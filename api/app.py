from pydantic import BaseModel, Field
from datetime import datetime
# from prisma import Prisma
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



if __name__ == '__main__':
    import uvicorn
    uvicorn.run(
        'test_fastRPC:app',
        host='0.0.0.0',
        port=8000,
        reload=True,
    )
