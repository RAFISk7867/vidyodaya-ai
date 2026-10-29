import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class StudyItem(Base):
    __tablename__ = "study_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    item_type = Column(String(50), index=True, nullable=False) # "assistant_qa", "concept_note", "summary", "question_set"
    title = Column(String(255), nullable=False)
    subject = Column(String(100), nullable=True)
    topic = Column(String(200), nullable=True)
    content = Column(Text, nullable=False)
    metadata_json = Column(Text, nullable=True) # JSON string for extra fields (e.g. mark scheme, tags)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="study_items")

