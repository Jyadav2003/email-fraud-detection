# backend/app/models/email_model.py
from sqlalchemy import Boolean, Column, Integer, String, Text, DateTime, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(100))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    emails = relationship("Email", back_populates="user")
    
class Email(Base):
    __tablename__ = "emails"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    sender = Column(String(255))
    subject = Column(String(255))
    body = Column(Text)
    received_date = Column(DateTime)
    analyzed = Column(Boolean, default=False)
    fraud_score = Column(Float, default=0.0)
    is_fraud = Column(Boolean, default=False)
    analysis_date = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="emails")
    indicators = relationship("FraudIndicator", back_populates="email")

class FraudIndicator(Base):
    __tablename__ = "fraud_indicators"
    
    id = Column(Integer, primary_key=True, index=True)
    email_id = Column(Integer, ForeignKey("emails.id"))
    indicator_type = Column(String(50))  # e.g., "suspicious_link", "spoofed_sender", etc.
    description = Column(Text)
    severity = Column(Integer)  # 1-10
    evidence = Column(Text, nullable=True)
    
    email = relationship("Email", back_populates="indicators")
