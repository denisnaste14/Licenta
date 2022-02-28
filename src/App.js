import './App.css';
import Navbar from './components/Navbar';
import Login from './components/Login';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    
      <>
      <Router>
         <AuthProvider>
           <Routes>
              <Route exact path="/" component={Navbar}/>
              <Route path="/login" component={Login} />
           </Routes>
         </AuthProvider>
      </Router>
      
    </>
  );
}

export default App;
