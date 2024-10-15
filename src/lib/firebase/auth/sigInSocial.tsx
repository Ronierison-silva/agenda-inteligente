import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import dbConfig from "../firebase";

const auth = getAuth(dbConfig);
const provider = new GoogleAuthProvider();

export default async function signInSocialGoogle() {
  let error = null;
  let result = null;
  
  await signInWithPopup(auth, provider).then((response)=> {
    result = response;
  }).catch((e) => {
    error = e;
  });

  return {result, error};
}