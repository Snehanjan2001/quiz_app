from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from utils.db_util import get_db
from models import Quiz, Question
from utils.quiz_util import generate_quiz_id
from database import SessionLocal
from schemas import QuizCreate
from utils.fetch_user_util import get_current_user

router = APIRouter()


@router.post("/create_quiz/")
def create_quiz(
    quiz: QuizCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    quiz_id = generate_quiz_id()

    new_quiz = Quiz(
        quiz_id=quiz_id,
        quiz_name=quiz.quiz_name,
        created_by=current_user
    )
    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)

    for question in quiz.questions:
        new_question = Question(
            question_text=question.question_text,
            options=json.dumps([option.dict() for option in question.options]),
            quiz_id=new_quiz.quiz_id
        )
        db.add(new_question)

    db.commit()

    return {
        "message": "Quiz and questions created successfully",
        "quiz_id": quiz_id,
        "user": current_user
    }
