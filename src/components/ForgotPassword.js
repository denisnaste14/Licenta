import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../components/FontawsomeIcons/Icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './StylesCss/ForgotPassword.css'
import { useAuth } from '../context/AuthContext'

export default function ForgotPassword() {
  const [email,setEmail] = useState()
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState('')
  const { recover_password } = useAuth()

  function displayerror() {
    if(error!='')
    {
      return <><FontAwesomeIcon icon='triangle-exclamation' opacity='0.75'/> {error}</>
       
    }
    return ""
  }

  const forgot_password_action = async e =>{
    e.preventDefault()
    try{
      setError("")
      setLoading(true)
      await recover_password(email)
    }catch{
      setError("Failed to recover password")
    }
    setLoading(false)
  }

  return (
    <>
      <div className='fp'>
        <div className='fp-container'>
          <div className='fp-title'>
            <FontAwesomeIcon icon='key' opacity='0.75' />
            <p className='fp-title-text'>Password recovery</p>
          </div>
          <div className='fp-bad-credentials'>
            {displayerror()}
          </div>
          <div className='fp-form'>
            <form onSubmit={forgot_password_action}>
              <div className='fp-group'>
                <FontAwesomeIcon icon='at' opacity='0.75' />
                <label for="email" className='fp-label'> Email:</label><br />
                <input className='fp-input' type="email" id="email" name="email" onChange={e => { setEmail(e.target.value) }} /><br />
              </div>
              <div className='fp-submit-btn'>
                <input type="submit" value="Recover Password" id='fp-submit' disabled={loading} />
              </div>
            </form>
            <div className='fp-forgot-password'>
              <Link to='/login' className='fp-forgot-password'>Log In</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
