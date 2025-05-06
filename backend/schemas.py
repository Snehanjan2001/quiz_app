from pydantic import BaseModel
from typing import List


class UserCreate(BaseModel):
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


# ---------------------  Questions -----------------------


class OptionCreate(BaseModel):
    option_value: str
    is_correct: bool


class QuestionCreate(BaseModel):
    question_text: str
    options: List[OptionCreate]


class QuizCreate(BaseModel):
    quiz_name: str
    questions: List[QuestionCreate]


class AnswerSubmission(BaseModel):
    nickname: str
    selected_option_index: int
