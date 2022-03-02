import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './components/Login';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';


ReactDOM.render(
    <React.StrictMode>
      <App/>
    </React.StrictMode>, 
  document.getElementById('root')
);
