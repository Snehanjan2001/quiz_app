from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.db_util import get_db
from database import SessionLocal
from models import User
from schemas import UserCreate, UserLogin, Token
from utils.auth_util import get_password_hash, verify_password, create_access_token


router = APIRouter()


# SIgnup

@router.post("/api/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        User.username == user.username).first()
    if existing_user:
        raise HTTPException(
            status_code=400, detail="Username already registered")

    hashed_pw = get_password_hash(user.password)
    new_user = User(username=user.username, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully", "user": new_user}


# LOGIN

@router.post("/api/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):

    print("recieved user : ",user)


    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": db_user.username})
    return {"access_token": token, "token_type": "bearer"}
