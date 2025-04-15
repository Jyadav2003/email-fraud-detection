# backend/app/services/analyzer.py
from datetime import datetime
from .email_processor import EmailProcessor
from .ml_classifier import FraudClassifier
from ..models.email_model import Email, FraudIndicator
from sqlalchemy.orm import Session

class EmailAnalyzer:
    def __init__(self, model_path=None):
        self.processor = EmailProcessor()
        self.classifier = FraudClassifier(model_path)
        
    async def analyze_email(self, raw_email, db: Session, user_id: int = None):
        """Analyze an email and save results to database"""
        # Parse the email
        parsed_email = self.processor.parse_email(raw_email)
        
        # Get prediction
        prediction = self.classifier.predict(parsed_email)
        
        # Create database entry
        if user_id is not None:
            email_record = Email(
                user_id=user_id,
                sender=parsed_email["headers"]["from"],
                subject=parsed_email["headers"]["subject"],
                body=parsed_email["body"],
                received_date=datetime.now(),  # Or parse the actual date from headers
                analyzed=True,
                fraud_score=prediction["fraud_probability"],
                is_fraud=prediction["is_fraud"],
                analysis_date=datetime.now()
            )
            db.add(email_record)
            db.commit()
            db.refresh(email_record)
            
            # Add indicators
            for indicator in prediction["indicators"]:
                db_indicator = FraudIndicator(
                    email_id=email_record.id,
                    indicator_type=indicator["type"],
                    description=indicator["description"],
                    severity=indicator["severity"],
                    evidence=None  # Could add specific evidence in a real system
                )
                db.add(db_indicator)
            
            db.commit()
            
            return {
                "id": email_record.id,
                "analysis": prediction,
                "email_data": {
                    "sender": parsed_email["headers"]["from"],
                    "subject": parsed_email["headers"]["subject"],
                    "date": parsed_email["headers"]["date"]
                }
            }
        else:
            # Just return analysis without saving to database
            return {
                "id": None,
                "analysis": prediction,
                "email_data": {
                    "sender": parsed_email["headers"]["from"],
                    "subject": parsed_email["headers"]["subject"],
                    "date": parsed_email["headers"]["date"]
                }
            }
    
    async def analyze_text(self, email_content):
        """Analyze email content provided as text"""
        # Convert text to raw email format
        # This is simplified - a real implementation would create proper email structure
        raw_email = f"""
From: unknown@example.com
To: user@example.com
Subject: {email_content[:50]}
Date: {datetime.now().strftime('%a, %d %b %Y %H:%M:%S +0000')}
Content-Type: text/plain

{email_content}
"""
        # Parse the email
        parsed_email = self.processor.parse_email(raw_email.encode())
        
        # Get prediction
        prediction = self.classifier.predict(parsed_email)
        
        return {
            "analysis": prediction,
            "email_data": {
                "text": email_content[:100] + "..." if len(email_content) > 100 else email_content
            }
        }
    
    def provide_feedback(self, email_id, is_fraud, db: Session):
        """Update model based on user feedback"""
        email = db.query(Email).filter(Email.id == email_id).first()
        if not email:
            return {"success": False, "message": "Email not found"}
        
        # Parse the stored email
        raw_email = f"""
From: {email.sender}
Subject: {email.subject}
Content-Type: text/plain

{email.body}
"""
        parsed_email = self.processor.parse_email(raw_email.encode())
        
        # Update the model
        self.classifier.update_model(parsed_email, is_fraud)
        
        # Update the database
        email.is_fraud = is_fraud
        db.commit()
        
        return {"success": True, "message": "Feedback recorded"}
