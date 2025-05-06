from utils.db_util import get_db
from utils.fetch_user_util import get_current_user
from models import Quiz, Question, QuizSession
from database import SessionLocal
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException
import random
import string


def generate_session_code(length=6):
    characters = string.ascii_uppercase + string.digits
    return ''.join(random.choices(characters, k=length))


router = APIRouter()


@router.post("/host/start_session/{quiz_id}")
def start_session(
    quiz_id: str,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    quiz = db.query(Quiz).filter(Quiz.quiz_id == quiz_id).first()

    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found.")

    questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()

    if not questions:
        raise HTTPException(
            status_code=404, detail="No questions found for this quiz.")

    session_code = generate_session_code()

    # Store session details
    new_session = QuizSession(
        session_code=session_code,
        quiz_id=quiz.quiz_id,
        host_username=current_user,
        current_question_index=0
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return {
        "message": "Quiz session started successfully!",
        "session_code": session_code,
        "quiz_name": quiz.quiz_name,
        "total_questions": len(questions)
    }
