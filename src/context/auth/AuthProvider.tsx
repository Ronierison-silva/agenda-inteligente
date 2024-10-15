"use client";
import firebase from "@/lib/firebase/firebase";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import React, { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

interface AuthContextProviderProps {
  children: ReactNode;
}
const auth = getAuth(firebase);

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [userAuth, setUserAuth] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUserCredentials: User | null) => {
      setUserAuth(authUserCredentials);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function logout() {
    let result = null,
        error = null;
    try {
      result = await signOut(auth);
    } catch (e){
      error = e;
    }
    return { result, error }
  }

  return(
    <AuthContext.Provider value={{ userAuth, logout }}>
      {loading
        ?
        <div>
          <h1>Loading...</h1>
        </div>
        :
        children
      }
    </AuthContext.Provider>
  )

}