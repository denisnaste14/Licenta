import React, {useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../components/FontawsomeIcons/Icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuth } from '../context/AuthContext'
import './StylesCss/Login.css'


function Login() {
  const [email,setEmail] = useState()
  const [password,setPassword] = useState()
  const [error,setError] = useState('')
  const [loading,setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate();

  const login_action = async e =>{
    e.preventDefault()
    try{
      setError("")
      setLoading(true)
      await login(email,password)
      navigate('/')
    }catch{
      setError("Failed to log in")
    }
    setLoading(false)
  }
  return (
      <>
        <div className='login'>
            <div className='login-container'>
                <div className='login-title'>
                  <FontAwesomeIcon icon='circle-user' opacity='0.75'/>
                    <p className='login-title-text'>Log In</p>
                </div>
                <div className='login-bad-credentials'>
                  {error!=='' ? <><FontAwesomeIcon icon='triangle-exclamation' opacity='0.75'/> {error}</>:""}
                </div>
                <div className='login-form'>
                  <form onSubmit={login_action}>
                    <div className='login-group'>
                    <FontAwesomeIcon icon='at' opacity='0.75'/>
                      <label for="email" className='login-label'> Email:</label><br/>
                      <input className='login-input' type="email" id="email" name="email" onChange={e => {setEmail(e.target.value)}}/><br/>
                    </div>
                    <div className='login-group'>
                    <FontAwesomeIcon icon='lock' opacity='0.75'/>
                      <label for="password" className='login-label'> Password:</label><br/>
                      <input className='login-input' type="password" id="password" name="password" onChange={e => setPassword(e.target.value)}/><br/>
                    </div>
                    <div className='login-submit-btn'>
                      <input type="submit" value="Login" id='login-submit' disabled={loading}/>
                    </div>
                  </form>
                  <div className='login-forgot-password'>
                      <Link to='/forgot-password' className='login-forgot-password'>Forgot password?</Link>
                  </div>
                </div>
            </div>
        </div>
      </>
  )
}
export default Login