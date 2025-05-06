from fastapi import Depends, HTTPException, APIRouter
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import AnswerSubmission
from utils.db_util import get_db
from models import Question, QuizSession, SessionPlayer
import json

router = APIRouter()


# join session (it would have the player nickname and session id and player joins the session)

@router.post("/play/join_session/{session_code}")
def player_join_session(session_code: str, player_nickname: str, db: Session = Depends(get_db)):

    quiz_session = db.query(QuizSession).filter(
        session_code == QuizSession.session_code).first()

    if not quiz_session:
        return HTTPException(status_code=404, detail="Session not created")

    existing_player = db.query(SessionPlayer).filter(
        SessionPlayer.session_code == session_code,
        SessionPlayer.nickname == player_nickname
    ).first()

    if existing_player:
        raise HTTPException(
            status_code=400, detail="Nickname already taken in this session.")

    new_player = SessionPlayer(
        session_code=session_code,
        nickname=player_nickname,
        score=0,
        current_question_index=0

    )

    db.add(new_player)
    db.commit()
    db.refresh(new_player)

    total_players = db.query(SessionPlayer).filter(
        SessionPlayer.session_code == session_code).count()

    return {
        "message": f" Player {player_nickname} joined the session {session_code} !!! Hurrah",
        "total_active_players": total_players,
    }


# play session (the question would come from the host and the player would response teh anwer, the answer with the time is checked and verifier)
@router.post("/play/submit_answer/{session_code}")
def submit_answer(
    session_code: str,
    answer: AnswerSubmission,
    db: Session = Depends(get_db)
):
    # 1. Fetch the session
    quiz_session = db.query(QuizSession).filter(
        QuizSession.session_code == session_code).first()

    if not quiz_session:
        raise HTTPException(status_code=404, detail="Session not found.")

    if not quiz_session.question_active:
        raise HTTPException(
            status_code=400, detail="No active question. Wait for host to start.")

    # 2. Fetch the player
    player = db.query(SessionPlayer).filter(
        SessionPlayer.session_code == session_code,
        SessionPlayer.nickname == answer.nickname
    ).first()

    if not player:
        raise HTTPException(
            status_code=404, detail="Player not found in this session.")

    # 3. Fetch current question
    questions = db.query(Question).filter(
        Question.quiz_id == quiz_session.quiz_id).order_by(Question.id).all()

    if player.current_question_index >= len(questions):
        raise HTTPException(
            status_code=400, detail="No more questions to answer.")

    current_question = questions[player.current_question_index]

    # 4. Parse options
    options = json.loads(current_question.options)

    if answer.selected_option_index < 0 or answer.selected_option_index >= len(options):
        raise HTTPException(status_code=400, detail="Invalid option selected.")

    selected_option = options[answer.selected_option_index]

    # 5. Check correctness
    correct = selected_option["is_correct"]

    # 6. Update score
    if correct:
        player.score += 1

    # 7. Move player to next question
    player.current_question_index += 1
    quiz_session.question_active = False

    db.commit()

    return {
        "correct": correct,
        "message": "✅ Correct!" if correct else "❌ Wrong!",
        "new_score": player.score,
        "questions_answered": player.current_question_index,
        "total_questions": len(questions)
    }


# final score(leaderboard the fincla score of the quiz is calculated)
@router.get("/play/final_score/{session_code}")
def final_score(
    session_code: str,
    db: Session = Depends(get_db)
):
    # 1. Check if session exists
    quiz_session = db.query(QuizSession).filter(
        QuizSession.session_code == session_code).first()

    if not quiz_session:
        raise HTTPException(status_code=404, detail="Session not found.")

    # 2. Fetch all players in session
    players = db.query(SessionPlayer).filter(
        SessionPlayer.session_code == session_code).all()

    if not players:
        raise HTTPException(
            status_code=404, detail="No players found in this session.")

    # 3. Sort players by score descending
    leaderboard = sorted(
        [{"nickname": p.nickname, "score": p.score} for p in players],
        key=lambda x: x["score"],
        reverse=True
    )

    return {
        "session_code": session_code,
        "leaderboard": leaderboard
    }
