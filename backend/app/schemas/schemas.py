from pydantic import BaseModel, EmailStr
from typing import Optional, Dict
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UploadBase(BaseModel):
    filename: str
    mapping: Optional[Dict[str, str]] = None

class Upload(UploadBase):
    id: int
    user_id: int
    created_at: datetime
    class Config:
        from_attributes = True
