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


# class User(BaseModel):
#     username: str
#     email: Union[str, None] = None
#     full_name: Union[str, None] = None
#     disabled: Union[bool, None] = None


@app.RPC
async def getUser(current_user: CurrentUser):
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
