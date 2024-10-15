import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import dbConfig from "../firebase";

const auth = getAuth(dbConfig);
export default async function signIn(email:string, password:string) {
  let error = null;
  let result = null;
  
  await signInWithEmailAndPassword(auth, email, password).then((response)=> {
    result = response;
  }).catch((e) => {
    error = e;
  });

  return {result, error};
}