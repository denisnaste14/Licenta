import './App.css';
import Navbar from './components/Navbar'
import Login from './components/Login'
import ForgotPassword from './components/ForgotPassword'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'; 
import Home from './views/Home.js';
import Signup from './components/Signup';
import Chat from './views/Chat';
function App() {
  return (
      <>
      <AuthProvider>     
      <Router>
           <Routes>
              <Route path="/login" element={<Login/>} />
              <Route path="signup" element={<Signup/>}/>
              <Route path="/forgot-password" element={<ForgotPassword/>}/>
              <Route element={<PrivateRoute/>}>
                  <Route path="/" element={<Navbar/>}/>
                  <Route path='/home' element={<Home/>}/>
                  <Route path='/chat' element={<Chat/>}/>
              </Route>
           </Routes>
      </Router>
      </AuthProvider>
    </>
  )
}

export default App;
