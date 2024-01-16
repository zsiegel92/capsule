import os
from datetime import datetime

from pydantic import BaseModel, Field
from typing import Annotated, Union

from prisma import Prisma
from prisma.models import Capsule, User

from passlib.context import CryptContext
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import jwt as pyjwt

from .FastRPC import FastRPC

app = FastRPC(prefix='/api/py')


class MessageData(BaseModel):
    message: str
    currentTime: datetime = Field(default_factory=datetime.now)


@app.RPC
async def hello(message: MessageData) -> MessageData:
    '''Retuns a message depending on the route.'''
    return MessageData(message=message.message)


@app.RPC
async def hello2(message: MessageData) -> MessageData:
    '''Retuns a message depending on the route.'''
    return MessageData(message=message.message)


@app.RPC
async def hello3(message: str) -> MessageData:
    '''Retuns a message depending on the route.'''
    return MessageData(message=message)


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
ALGORITHM = "HS256"  # "HS512"  #"HS256" # next-auth uses "A256GCM" by default
SECRET_KEY = os.environ.get('NEXTAUTH_SECRET')

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# class User(BaseModel):
#     username: str
#     email: Union[str, None] = None
#     full_name: Union[str, None] = None
#     disabled: Union[bool, None] = None


class BasicUser(BaseModel):
    email: str
    # sub: str


class Session(BaseModel):
    user: BasicUser
    iat: int


async def decode_token(token: str) -> Session:
    payload = pyjwt.decode(
        token,
        key=SECRET_KEY,
        algorithms=[ALGORITHM],
        options={
            #     "verify_signature": False,
            'verify_exp': False,
            #     'verify_nbf': False,
            'verify_iat': False,
            #     'verify_aud': False,
        },
    )
    return Session(**payload)


async def get_current_user(
        token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    session = await decode_token(token)
    prisma = Prisma()
    await prisma.connect()
    user = await prisma.user.find_first(where={
        'email': session.user.email,
        # 'id': session['user']['sub'],
    })
    return user


@app.RPC
async def getUser(
        current_user: Annotated[User, Depends(get_current_user)]) -> User:
    '''Retuns a message depending on the route.'''
    print('PRINTING CURRENT USER FROM PYTHON!')
    print(current_user)

    return current_user

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(
        'test_fastRPC:app',
        host='0.0.0.0',
        port=8000,
        reload=True,
    )
