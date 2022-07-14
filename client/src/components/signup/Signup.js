import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css'
import axios from 'axios';
import { setToken } from '../Auth';

function Signup() {
    let navigate = useNavigate()
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,SetError] = useState("")
    const [showError,setshowError] = useState(false)
    const submit =()=>{
        console.log(username);
        console.log(email);
        console.log(password);
        
        const registration_data = {
            "username":username,
            "emailid":email,
            "password":password
        }
        axios.post("http://127.0.0.1:8001/register",registration_data)
        .then(response => {
            if(response.data["status"] === 200)
            {
                console.log(response)
                setToken(response.data["token"]);
                navigate('/dashboard')
            }
            else if( response.data["status"] === 401 || response.data["status"] === 402)
            {
                SetError(response.data["details"])
                setshowError(true)
            }
        })
        .catch(err => console.log(err))
    }
    return (
        <div className='centered'>
           <div className='signup-box'>
             <h1>Sign Up</h1>
             { showError ? <p>{error}</p>:""}
             <input
              className='signup-box_input' 
              placeholder='Username'
              onChange={(event) => {setUsername(event.target.value)}}
             />
             <input
              className='signup-box_input' 
              placeholder='Email Address'
              onChange={(event) => {setEmail(event.target.value)}}
             />
             <input
              className='signup-box_input' 
              placeholder='Password'
              type='password'
              onChange={(event) => {setPassword(event.target.value)}}
             />
             <a href='/'>Already Registered? Go to Dashboard</a>
             <button 
              className='signup-box_button'
              onClick={submit}
             >Go To Dashboard</button> 
           </div>
        </div>
    );
}

export default Signup;