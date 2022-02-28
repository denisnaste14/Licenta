import React, { useContext, useState } from 'react'
import { auth } from '../utils/firebase';

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({ childern }) {
    const [loggedUser, setLoggedUser] = useState();

    function login(email,password){
        return auth.signInWithEmailAndPassword(email,password);
    }

    const x = {
        loggedUser
    }
  return (
    <AuthContext.Provider>
        {childern}
    </AuthContext.Provider>
  )
}
