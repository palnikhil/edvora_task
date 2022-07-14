import './App.css';
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import Chat from './components/chat/Chat';
import {Routes, Route} from 'react-router-dom';
import ChatHome from './components/chat/ChatHome';

function App() {
  return (
      <Routes>
        <Route exact path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={<ChatHome />} />
      </Routes>
  );
}

export default App;
