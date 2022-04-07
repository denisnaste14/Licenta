import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './StylesCss/Navbar.css'

function Navbar() {
    const [click,setClick]=useState(false);
    const [button,setButton]=useState(true);
    const [error, setError]= useState()
    const {loggedUser, logout} = useAuth()

    async function logout_action(){
        setError('')
        setClick(false)
        try{
            await logout()
        }catch{
            setError('Failed to log out')
        }
    }

    const showButton =()=>{
        if(window.innerWidth<900){
            setButton(false);
        }
        else{
            setButton(true);
        }
    }

    window.addEventListener('resize', showButton);

    return (
        <>
        <nav className="navbar"> 
            <div className ="navbar-container">
                <Link to="/" className="navbar-logo">
                    Title
                </Link>
                <div className="menu-icon" onClick={()=>setClick(!click)}>
                    <i className={click ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>
                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    <li className='nav-item'>
                        <Link to='/home' className='nav-link' onClick={()=>setClick(false)}>
                            Home
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/marketplace' className='nav-link' onClick={()=>setClick(false)}>
                            Marketplace
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/news' className='nav-link' onClick={()=>setClick(false)}>
                            News
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/members' className='nav-link' onClick={()=>setClick(false)}>
                            Members
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/login' className='nav-link' onClick={logout_action}>
                            Logout
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
        </>
    )
}

export default Navbar
