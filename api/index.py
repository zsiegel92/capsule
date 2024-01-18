import os
from datetime import datetime

from pydantic import BaseModel, Field
from typing import Annotated, Union

from prisma import Prisma
from prisma.models import Capsule, User

from passlib.context import CryptContext
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from .FastRPC import FastRPC, CurrentUser

app = FastRPC(prefix='/api')


class MessageData(BaseModel):
    message: str
    currentTime: datetime = Field(default_factory=datetime.now)


@app.RPC
async def hello(message: MessageData) -> MessageData:
    '''Retuns a message depending on the message body.'''
    return MessageData(message=message.message)


@app.RPC
async def hello2(message: str) -> MessageData:
    '''Retuns a message depending on the message body.'''
    return MessageData(message=message)


# class User(BaseModel):
#     username: str
#     email: Union[str, None] = None
#     full_name: Union[str, None] = None
#     disabled: Union[bool, None] = None


@app.get_RPC
async def hello4() -> str:
    '''Retuns a hello message.'''
    return 'hello 4'


@app.RPC
async def getUser(current_user: CurrentUser) -> User:
    '''Retuns the current user.'''
    print('PRINTING CURRENT USER FROM PYTHON!')
    print(current_user)
    current_user.password = None
    return current_user






if __name__ == '__main__':
    import uvicorn
    uvicorn.run(
        'test_fastRPC:app',
        host='0.0.0.0',
        port=8000,
        reload=True,
    )
