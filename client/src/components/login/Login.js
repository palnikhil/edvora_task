import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import './Login.css'
import { setToken } from '../Auth'

function Login() {
    let navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [error,SetError] = useState("")
    const [showError,setshowError] = useState(false)
    const submit = () => {
        console.log(email);
        console.log(password);
        
        const login_data = {
            "emailid":email,
            "password":password
        }
        axios.post("http://127.0.0.1:8001/login",login_data)
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
            
           <div className='login-box'>
             <h1>Login</h1>
             { showError ? <p>{error}</p>:""}
             <input
              className='login-box_input' 
              placeholder='Email Address'
              onChange={(event) => {setEmail(event.target.value)}}
             />
             <input
              className='login-box_input' 
              placeholder='Password'
              type='password'
              onChange={(event) => {setPassword(event.target.value)}}
             />
             <a href='/signup'>New! please Click here</a>
             <button 
              className='login-box_button'
              onClick={submit}
             >Go To Dashboard</button> 
           </div>
        </div>
    );
}

export default Login;