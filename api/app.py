import os
from datetime import datetime

from pydantic import BaseModel, Field
from typing import Annotated, Union

from prisma import Prisma
from prisma.models import Capsule, User

from passlib.context import CryptContext
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

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


@app.RPC
async def getUser(token: Annotated[str, Depends(oauth2_scheme)], ) -> User:
    '''Retuns a message depending on the route.'''
    prisma = Prisma()
    await prisma.connect()
    user = await prisma.user.find_first(where={'id': 1})
    print(f'PRINTING USER FROM PYTHON: {user}')
    print(token)
    # user = User(id=1, name='test', email='test', password='test')
    # print(f'PRINTING USER FROM PYTHON: {user}')
    return user

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(
        'test_fastRPC:app',
        host='0.0.0.0',
        port=8000,
        reload=True,
    )
