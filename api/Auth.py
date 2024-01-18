import os

from pydantic import BaseModel, Field
from typing import Annotated, Union, Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

import jwt as pyjwt
from starlette.requests import Request

from .prisma.client import Prisma  # from prisma import Prisma if client in site_libs
from .prisma.models import User  # can use prisma.models
# by default Prisma client generates to site_libs/prisma/models.py
# schema.prisma specifies to generate to this version-controlled repo, so that Python client does not have to be built on deployment.


class Session(BaseModel):
    email: str
    sub: Union[str, int]
    iat: Union[int, float]
    exp: Union[int, float, None] = None


async def decode_token(token: str) -> Session:
    # print(f"TOKEN: {token}")
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
    # print("PAYLOAD")
    # print(payload)
    try:
        session = Session(**payload)
    except:
        raise HTTPException(
            status_code=400,
            detail="Invalid token",
        )
    return session


async def TOKENDEBUGGER(request: Request) -> Optional[str]:
    '''Use with `Depends(TOKENDEBUGGER)` to print the token.'''
    authorization = request.headers.get("Authorization")
    print("AUTHORIZATION:")
    print(authorization)
    return request.headers.get("Authorization").removeprefix('Bearer ')


# TODO: Implement `tokenUrl` handling Python-side.
async def get_current_user(
    token: Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl="token"))]
    # token: Annotated[str, Depends(TOKENDEBUGGER)]
) -> User:
    '''Get the current user from the token.'''
    session = await decode_token(token)
    prisma = Prisma()
    await prisma.connect()
    user = await prisma.user.find_first(where={
        'email': session.email,
    })
    if not user:
        raise HTTPException(
            status_code=400,
            detail="Incorrect username or password",
        )
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
