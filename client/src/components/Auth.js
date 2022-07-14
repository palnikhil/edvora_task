import {
    useNavigate
  } from "react-router-dom";

export const setToken = (token) =>{
    // set token in localStorage
    localStorage.setItem('chatToken', token)
}
export const fetchToken = () =>{
    // fetch the token
    return localStorage.getItem('chatToken')
}
export function RequireToken({children}) {
    
    let auth = fetchToken();
    let navigate = useNavigate();
    
    if (!auth) {
      
      navigate('/')
    }
  
    return children;
}