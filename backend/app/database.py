from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

# SQLite specific connect_args
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    from app.models.user import User
    from app.models.document import Document
    from app.models.study_item import StudyItem
    from app.models.quiz import Quiz, QuizAttempt
    Base.metadata.create_all(bind=engine)
    seed_demo_user()

def seed_demo_user():
    """
    Ensures the default educational demo student account exists on startup.
    """
    from app.models.user import User
    from app.utils.security import get_password_hash
    db = SessionLocal()
    try:
        demo_email = "demo.student@vidyodaya.edu"
        existing = db.query(User).filter(User.email == demo_email).first()
        if not existing:
            demo_user = User(
                email=demo_email,
                full_name="Demo Student",
                hashed_password=get_password_hash("VidyodayaPass123!"),
                is_active=True
            )
            db.add(demo_user)
            db.commit()
    except Exception:
        db.rollback()
    finally:
        db.close()

# Ensure tables are created
create_tables()
