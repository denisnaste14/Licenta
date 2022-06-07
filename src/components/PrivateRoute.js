import React from 'react'
import { useAuth } from '../context/AuthContext'
import Login from './Login'
import { Outlet } from 'react-router'
import Navbar from './Navbar'

const PrivateRoute = () => {
  const {loggedUser} = useAuth()
  console.log(loggedUser)
  return loggedUser ? <><Navbar></Navbar> <Outlet/></> : <Login/>;
}

export default PrivateRoute