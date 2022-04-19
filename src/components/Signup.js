import React, {useState } from 'react'
import '../components/FontawsomeIcons/Icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import "./StylesCss/Signup.css"

export default function Signup() {
  const [email,setEmail] = useState()
  const [password,setPassword] = useState()
  const [error,setError] = useState('')
  const [loading,setLoading] = useState(false)
  const { signup } = useAuth()

  const signup_action = async e =>{
    e.preventDefault()
  }

  return (
    <>
      <div className='signup'>
        <div className='signup-container'>
          <div className='signup-title'>
            <FontAwesomeIcon icon='circle-user' opacity='0.75' />
            <p className='signup-title-text'>Sign Up</p>
          </div>
          <div className='signup-bad-credentials'>
            {error !== '' ? <><FontAwesomeIcon icon='triangle-exclamation' opacity='0.75' /> {error}</> : ""}
          </div>
          <div className='signup-form'>
            <form onSubmit={signup_action}>
              <div className='signup-group'>
                <FontAwesomeIcon icon='at' opacity='0.75' />
                <label for="email" className='signup-label'> Email:</label><br />
                <input className='signup-input' type="email" id="email" name="email" onChange={e => { setEmail(e.target.value) }} /><br />
              </div>
              <div className='signup-group'>
                <FontAwesomeIcon icon='lock' opacity='0.75' />
                <label for="password" className='signup-label'> Password:</label><br />
                <input className='signup-input' type="password" id="password" name="password" onChange={e => setPassword(e.target.value)} /><br />
              </div>
              <div className='signup-group'>
                <FontAwesomeIcon icon='lock' opacity='0.75' />
                <label for="password" className='signup-label'> Confirm password:</label><br />
                <input className='signup-input' type="password" id="password" name="password" onChange={e => setPassword(e.target.value)} /><br />
              </div>
              <div className='signup-submit-btn'>
                <input type="submit" value="signup" id='signup-submit' disabled={loading} />
              </div>
            </form>
            <div className='signup-forgot-password'>
              <Link to='/forgot-password' className='signup-forgot-password'>Forgot password?</Link>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
