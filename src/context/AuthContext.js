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

    function logout(){
        return auth.signOut()
    }

    function recover_password(email){
        return auth.sendPasswordResetEmail(email)
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
        login,
        logout,
        recover_password
    }
  return (
    <AuthContext.Provider value={x}>
        {!loading && children}
    </AuthContext.Provider>
  )
}
