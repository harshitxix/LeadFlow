from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
import datetime

DATABASE_URL = "sqlite:///../data/leads.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Lead(Base):
    __tablename__ = "leads"
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, index=True)
    contact_name = Column(String)
    designation = Column(String)
    industry = Column(String)
    company_size = Column(String)
    requirement = Column(Text)
    budget = Column(String)
    timeline = Column(String)
    source = Column(String)
    status = Column(String, default="New")
    priority = Column(String, default="Medium")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Analysis(Base):
    __tablename__ = "analysis"
    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, index=True)
    qualification = Column(String)
    qualification_reasons = Column(Text)
    missing_information = Column(Text)
    recommended_action = Column(String)
    research_summary = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Activity(Base):
    __tablename__ = "activities"
    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, index=True)
    activity_type = Column(String)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

Base.metadata.create_all(bind=engine)
