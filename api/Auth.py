import os

from pydantic import BaseModel, Field
from typing import Annotated, Union

from prisma import Prisma

from passlib.context import CryptContext
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

import jwt as pyjwt

from prisma.models import User


class BasicUser(BaseModel):
    email: str
    # sub: str


class Session(BaseModel):
    user: BasicUser
    iat: int


async def decode_token(token: str) -> Session:
    payload = pyjwt.decode(
        token,
        key=os.environ.get('NEXTAUTH_SECRET'),
        algorithms=["HS256"],
        options={
            #     "verify_signature": False,
            'verify_exp': True,
            #     'verify_nbf': False,
            'verify_iat': True,
            #     'verify_aud': False,
        },
    )
    return Session(**payload)


async def get_current_user(
    token: Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl="token"))]
) -> User:
    session = await decode_token(token)
    prisma = Prisma()
    await prisma.connect()
    user = await prisma.user.find_first(where={
        'email': session.user.email,
        # 'id': session['user']['sub'],
    })
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
