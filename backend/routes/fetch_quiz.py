import json  # Make sure this import is there at the top
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.db_util import get_db
from database import SessionLocal
from models import Question, Quiz
from utils.fetch_user_util import get_current_user

router = APIRouter()


@router.get("/fetch_quiz")
def fetch_all_quiz(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch all quizzes created by the current logged-in user
    quizzes = db.query(Quiz).filter(Quiz.created_by == current_user).all()

    quiz_list = []
    for quiz in quizzes:
        quiz_list.append({
            "quiz_id": quiz.quiz_id,
            "quiz_name": quiz.quiz_name,
            "created_at": getattr(quiz, 'created_at', None)
        })

    return {
        "user": current_user,
        "quizzes": quiz_list
    }


@router.get("/fetch_quiz/{quiz_id}")
def fetch_quiz_by_id(
    quiz_id: str,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    quiz = db.query(Quiz).filter(Quiz.quiz_id == quiz_id,
                                 Quiz.created_by == current_user).first()

    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found.")
    questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()
    question_list = []
    for q in questions:
        question_list.append({
            "question_text": q.question_text,
            "options": json.loads(q.options)
        })

    return {
        "quiz_id": quiz.quiz_id,
        "quiz_name": quiz.quiz_name,
        "questions": question_list
    }
