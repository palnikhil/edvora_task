from typing import Any
from fastapi import FastAPI,HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from schemas import AuthDetailsRegistration,AuthDetailsLogin
from auth import AuthHandler
import socketio
import uvicorn


app = FastAPI()

sio: Any = socketio.AsyncServer(async_mode="asgi",cors_allowed_origins=[])
socket_app = socketio.ASGIApp(sio,app)



origins = [
    "http://localhost:3000",
    "http:localhost"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/ws", socket_app)

client = MongoClient("mongodb+srv://nikhil:nikhil12345@edvora.1d8cklt.mongodb.net/?retryWrites=true&w=majority")

db = client["Auth"]
authentication = AuthHandler()

@sio.event
async def connect(sid, environ):
    await sio.emit("connected",{"data":"Connected"})
    print("connected ", sid)

@sio.on("send_message")
async def send_message(sid,data):
    print(data)
    await sio.emit("receive_message", data=data)

@sio.event
async def disconnect(sid):
    print('disconnected ', sid)



@app.post('/register')
def register(auth_details: AuthDetailsRegistration):
    username = auth_details.username
    email = auth_details.emailid
    password = auth_details.password
    
    user_found = db.users.find_one({"username":username})
    email_found = db.users.find_one({"email": email})

    if user_found:
      return ({"status":401,"details":"Username already registred"})
    if email_found:
      return ({"status":402,"details":"Email Address already in use. Please Login!"})
    
    hashed_password = authentication.get_password_hash(password)
    db.users.insert_one({"username":username,"email":email,"password":hashed_password})
    token = authentication.encode_token(username)
    
    return({"status": 200, "details":"Successfully Registered!", "token":token})
    

@app.post('/login')
def login(auth_details: AuthDetailsLogin):
    email = auth_details.emailid
    password = auth_details.password
    
    email_found = db.users.find_one({"email":email})
    if email_found:
        if(authentication.verify_password(password,email_found['password'])):
            token = authentication.encode_token(email_found['username'])
            return({"status": 200, "details":"Successfully Logged In!", "token":token})
        else:
            return({"status": 401, "details":"Wrong Password"})
    else:
        return({"status": 402, "details":"Invalid Email ID"})


@app.get('/dashboard')
def protected(username=Depends(authentication.auth_wrapper)):
    return { 'name': username }

@app.get('/test')
def test_app():
    return {"Hello World"}


if __name__=="__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8001,log_level="info")