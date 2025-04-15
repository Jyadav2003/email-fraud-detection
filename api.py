# backend/app/routes/api.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from ..services.analyzer import EmailAnalyzer
from ..models.email_model import Email, FraudIndicator
from ..database import get_db

router = APIRouter()
analyzer = EmailAnalyzer()

# Models for request/response
class EmailAnalysisRequest(BaseModel):
    content: str
    
class FeedbackRequest(BaseModel):
    email_id: int
    is_fraud: bool
    
class IndicatorResponse(BaseModel):
    type: str
    description: str
    severity: int
    evidence: Optional[str] = None
    
class AnalysisResponse(BaseModel):
    fraud_probability: float
    is_fraud: bool
    indicators: List[IndicatorResponse]
    
class EmailResponse(BaseModel):
    id: Optional[int]
    sender: str
    subject: str
    fraud_score: float
    is_fraud: bool
    indicators: List[IndicatorResponse]
    analyzed_at: str

@router.post("/analyze/upload", response_model=EmailResponse)
async def analyze_email_upload(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Analyze an uploaded email file"""
    try:
        content = await file.read()
        result = await analyzer.analyze_email(content, db)
        
        return {
            "id": result["id"],
            "sender": result["email_data"]["sender"],
            "subject": result["email_data"]["subject"],
            "fraud_score": result["analysis"]["fraud_probability"],
            "is_fraud": result["analysis"]["is_fraud"],
            "indicators": result["analysis"]["indicators"],
            "analyzed_at": result["analysis"]["analysis_date"] if "analysis_date" in result["analysis"] else str(datetime.now())
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze/text", response_model=AnalysisResponse)
async def analyze_email_text(request: EmailAnalysisRequest):
    """Analyze email content provided as text"""
    try:
        result = await analyzer.analyze_text(request.content)
        return result["analysis"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/feedback")
async def provide_feedback(
    request: FeedbackRequest,
    db: Session = Depends(get_db)
):
    """Provide feedback on an analysis to improve the model"""
    try:
        result = analyzer.provide_feedback(request.email_id, request.is_fraud, db)
        if not result["success"]:
            raise HTTPException(status_code=404, detail=result["message"])
        return {"message": "Feedback recorded successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/emails", response_model=List[EmailResponse])
async def get_user_emails(user_id: int, db: Session = Depends(get_db)):
    """Get all analyzed emails for a user"""
    emails = db.query(Email).filter(Email.user_id == user_id).all()
    
    result = []
    for email in emails:
        indicators = db.query(FraudIndicator).filter(FraudIndicator.email_id == email.id).all()
        indicator_responses = [
            IndicatorResponse(
                type=indicator.indicator_type,
                description=indicator.description,
                severity=indicator.severity,
                evidence=indicator.evidence
            ) for indicator in indicators
        ]
        
        result.append(
            EmailResponse(
                id=email.id,
                sender=email.sender,
                subject=email.subject,
                fraud_score=email.fraud_score,
                is_fraud=email.is_fraud,
                indicators=indicator_responses,
                analyzed_at=str(email.analysis_date)
            )
        )
    
    return result
