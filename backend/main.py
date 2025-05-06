from fastapi import FastAPI
from routes import start_quiz
from routes import create_quiz, fetch_quiz, create_session, play,ws_router
from database import Base, engine
from routes import auth
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(fetch_quiz.router)
app.include_router(create_quiz.router)
app.include_router(create_session.router)
app.include_router(play.router)
app.include_router(start_quiz.router)
app.include_router(ws_router.router)
