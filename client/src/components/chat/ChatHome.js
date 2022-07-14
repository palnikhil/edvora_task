import React, { useEffect,useState } from 'react';
import { fetchToken } from '../Auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import './Chat.css'
import Chat from './Chat'
import io from 'socket.io-client'
const socket = io("ws://127.0.0.1:8001", { path: "/ws/socket.io/", transports: ['websocket', 'polling'] })

function ChatHome() {
    let navigate = useNavigate()
    const [username, setUsername] = useState("");
    const room = "activityfeed";
    const [showChat, setShowChat] = useState(false);
    

    useEffect(()=>{
         const token  = fetchToken()
         if(token){
              axios.get("http://127.0.0.1:8001/dashboard",{ headers: {"Authorization" : `Bearer ${token}`} })
              .then(response => {setUsername(response.data["name"])})
              .catch(err => console.log(err))
         }
         else
         {
           navigate("/")
         }
    })

    const joinRoom = () => {
      if (username !== "" && room !== ""){
        setShowChat(true);
      }
    };
  
    return (
      <div className="App">
        {!showChat ? (
          <div className="joinChatContainer">
            <h3>Join A Chat</h3>
            <button onClick={joinRoom}>Join A Room</button>
          </div>
        ) : (
          <Chat socket={socket} username={username} room={room} />
        )}
      </div>
    );
}

export default ChatHome;