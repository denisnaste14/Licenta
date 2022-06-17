import './App.css';
import Login from './components/Login'
import ForgotPassword from './components/ForgotPassword'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute';
import Home from './views/Home.js';
import Signup from './components/Signup';
import Chat from './views/Chat';
import Members from './views/Members';
import EventPlanner from './views/EventPlanner';
import ExpenseReport from './views/ExpenseReport';
function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path='/home' element={<Home />} />
              <Route path='/chat' element={<Chat />} />
              <Route path='/members' element={<Members />} />
              <Route path='/event-planner' element={<EventPlanner />}/>
              <Route path='/expense-report' element={<ExpenseReport />}/>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </>
  )
}

export default App;
