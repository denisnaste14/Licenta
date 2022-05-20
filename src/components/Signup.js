import React, {useState } from 'react'
import '../utils/FontawsomeIcons/Icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import "./StylesCss/Signup.css"
import { toast } from 'react-toastify';

export default function Signup() {
  const [email,setEmail] = useState()
  const [password,setPassword] = useState()
  const [confPassword,setConfPassword] = useState()
  const [error,setError] = useState('')
  const [loading,setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const signup_action = async e =>{
    e.preventDefault()
    if(password !== confPassword){
      setError("Password and Confirm Password fields must be the same!")
      return;
    }
    try{
      setError('')
      setLoading(true)
      await signup(email,password);
      navigate('/login')
      toast.success("Account created sucessfully!", {position: toast.POSITION.TOP_CENTER, autoClose: 2000})
    }catch{
      setError("Failed to sign up!")
    }
    setLoading(false)
    
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
                <label for="confirm-password" className='signup-label'> Confirm password:</label><br />
                <input className='signup-input' type="password" id="confirm-password" name="confirm-password" onChange={e => setConfPassword(e.target.value)} /><br />
              </div>
              <div className='signup-submit-btn'>
                <input type="submit" value="Register" id='signup-submit' disabled={loading} />
              </div>
            </form>
          </div>
        </div>
        <div className='signup-forgot-password'>
              <Link to='/login' className='signup-forgot-password'>Already have an account?</Link>
        </div>
      </div>

    </>
  )
}
