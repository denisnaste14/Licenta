import React, { useContext, useState, useEffect } from 'react'
import { auth, db } from '../utils/firebase';

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

    function signup(email,password){
        return auth.createUserWithEmailAndPassword(email,password).then(x =>{
            return db.collection('user').doc(x.user.uid).set({
                nume:"",
                bio:"",
                imgSrc:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                admin:false,
            })
        });
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
        recover_password,
        signup
    }
  return (
    <AuthContext.Provider value={x}>
        {!loading && children}
    </AuthContext.Provider>
  )
}
