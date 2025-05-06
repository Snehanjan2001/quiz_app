from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from database import Base
from datetime import datetime
from sqlalchemy.types import Text


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)


class Quiz(Base):

    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(String, unique=True, index=True, nullable=False)
    quiz_name = Column(String, nullable=False)
    created_by = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now)


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(String, nullable=False)
    options = Column(Text)
    quiz_id = Column(String, ForeignKey("quizzes.quiz_id")
                     )  # Reference quiz_id (string!)

    # optional: backref if you want
    # quiz = relationship("Quiz", back_populates="questions")


class QuizSession(Base):
    __tablename__ = "quiz_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_code = Column(String, unique=True, index=True, nullable=False)
    quiz_id = Column(String, ForeignKey("quizzes.quiz_id"), nullable=False)
    host_username = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    current_question_index = Column(Integer, default=0)
    question_active = Column(Boolean, default=False)


class SessionPlayer(Base):
    __tablename__ = "session_players"

    id = Column(Integer, primary_key=True, index=True)
    session_code = Column(String, ForeignKey(
        "quiz_sessions.session_code"), nullable=False)
    nickname = Column(String, nullable=False)
    score = Column(Integer, default=0)
    current_question_index = Column(Integer, default=0)
