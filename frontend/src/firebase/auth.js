import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";

initializeApp(firebaseConfig);
const auth = getAuth();

export const SignInGoogle = ()=>{signInWithPopup(auth, provider)
.then((result) => {
  // This gives you a Google Access Token. You can use it to access the Google API.
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential.accessToken;
  // The signed-in user info.
  const user = result.user;
  // IdP data available using getAdditionalUserInfo(result)
  return user;
  // ...
}).catch((error) => {
  // Handle Errors here.
  const errorCode = error.code;
  const errorMessage = error.message;
  // The email of the user's account used.
  const email = error.customData.email;
  // The AuthCredential type that was used.
  const credential = GoogleAuthProvider.credentialFromError(error);
  // ...
});
}

export const SignUpEmail = (email, password) => {
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    // ...
    return user;
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
    console.log(errorCode, errorMessage);
  });

}

export const SignInEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}