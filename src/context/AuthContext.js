import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../utils/firebase';

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [loggedUser, setLoggedUser] = useState()
    const [loading, setLoading] = useState(true)

    function login(email,password){
        return auth.signInWithEmailAndPassword(email,password)
    }

    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged(user=>{
            setLoggedUser(user)
            setLoading(false)
        })
        return unsubscribe
    }, [])
    

    const x = {
        loggedUser,
        login
    }
  return (
    <AuthContext.Provider value={x}>
        {!loading && children}
    </AuthContext.Provider>
  )
}
