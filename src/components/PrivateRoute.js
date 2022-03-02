import React from 'react'
import { useAuth } from '../context/AuthContext'
import Login from './Login'
import { Outlet } from 'react-router'

const PrivateRoute = () => {
  const {loggedUser} = useAuth()
  console.log(loggedUser)
  return loggedUser ? <Outlet/> : <Login/>;
}

export default PrivateRoute