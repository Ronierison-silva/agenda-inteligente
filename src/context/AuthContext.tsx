"use client";
import { auth, provider } from "@/lib/firebase";
import ClientModel from "@/models/client.model";
import { HOME_ROUTES } from "@/utils/routes";
import { signInWithPopup, signOut } from "firebase/auth";
import Router from "next/router";
import { createContext, useState } from "react";

interface fireBaseAuthetication {
  user: ClientModel,
  loading: boolean,
  signin: () => void,
  signout:() => void
}
const AuthContext = createContext<fireBaseAuthetication>({}as fireBaseAuthetication);
export function AuthProvider({children}) {
  const {user, setUser} = useState<ClientModel>();
  const {loading, setLoading} = useState(true);

  const signin = () => {
    try {
      setLoading(true)
      return signInWithPopup(auth, provider)
      .then((response)=> {
        setUser(response.user)
        //Router.push(HOME_ROUTES);
      })
    } finally {
      setLoading(false);
    }
  }
  const signout = () => {
    try {
      Router.push(HOME_ROUTES);
      setLoading(true)
      return signOut(auth)
      .then(()=> {setUser(false)})
    } finally {
      setLoading(false);
    }
  }

  return <AuthContext.Provider value={{
    user,
    loading,
    signin,
    signout
  }}>{children}</AuthContext.Provider>
}
export const AuthConsumer = AuthContext.Consumer;
export default AuthContext;