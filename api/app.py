from pydantic import BaseModel, Field
from datetime import datetime
# from prisma import Prisma
from .FastRPC import FastRPC
from prisma import Prisma
from prisma.models import Capsule, User

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


@app.RPC
async def getUser() -> User:
    '''Retuns a message depending on the route.'''
    prisma = Prisma()
    await prisma.connect()
    user = await prisma.user.find_first(where={'id': 1})
    print(f'PRINTING USER FROM PYTHON: {user}')
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
