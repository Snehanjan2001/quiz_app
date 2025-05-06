from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.db_util import get_db
from utils.fetch_user_util import get_current_user
from models import QuizSession, Question
import json
from utils.socket_manager import socket_manager
import asyncio

router = APIRouter()


@router.post("/host/start_question/{session_code}")
async def start_question(
    session_code: str,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)  # ✅ Require authentication
):
    # 1. Fetch session
    quiz_session = db.query(QuizSession).filter(
        QuizSession.session_code == session_code).first()

    if not quiz_session:
        raise HTTPException(status_code=404, detail="Session not found.")

    # ✅ 2. Host authorization check
    if current_user != quiz_session.host_username:
        raise HTTPException(
            status_code=401, detail="Unauthorized: Only the Host can start questions.")

    # 3. Fetch questions
    questions = db.query(Question).filter(
        Question.quiz_id == quiz_session.quiz_id).order_by(Question.id).all()

    if not questions:
        raise HTTPException(
            status_code=404, detail="No questions found for this quiz.")

    # 4. Current index
    current_index = quiz_session.current_question_index

    if current_index >= len(questions):
        raise HTTPException(
            status_code=400, detail="No more questions. Quiz finished.")

    current_question = questions[current_index]

    # 5. Move to next question
    quiz_session.current_question_index += 1
    quiz_session.question_active = True  # Mark question as active
    db.commit()

    #6. using websocket to throw the data

    data_to_send = {
        "question_number": current_index + 1,
        "question_text": current_question.question_text,
        "options": json.loads(current_question.options)
    }

    # Broadcast to all players in that session
    print(f"🛰️ Broadcasting to session {session_code}: {data_to_send}")
    await socket_manager.broadcast(session_code, data_to_send)

    return data_to_send

    
