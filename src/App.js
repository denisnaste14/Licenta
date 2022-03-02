import './App.css';
import Navbar from './components/Navbar'
import Login from './components/Login';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
      <>
      <AuthProvider>
      <Router>
           <Routes>
              <Route exact path="/" element={<Navbar/>}/>
              <Route path="/login" element={<Login/>} />
           </Routes>
      </Router>
      </AuthProvider>
    </>
  )
}

export default App;
