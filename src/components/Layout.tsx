import { FirebaseError } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"

function Layout() {
  const navigate = useNavigate()
  const auth = getAuth()
  const [currentUser, setCurrentUser] = useState(auth.currentUser)

  const provider = new GoogleAuthProvider()
  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user
        setCurrentUser(user)
        console.log(user.email)
      })
      .catch((error: FirebaseError) => {
        const errorCode = error.code
        const errorMessage = error.message
        const email = error.customData?.email
        const credential = GoogleAuthProvider.credentialFromError(error)
        console.error(errorCode, errorMessage, email, credential)
      })
  }
  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        setCurrentUser(null)
      })
      .catch((error: FirebaseError) => {
        console.error(error.code, error.message)
      })
  }

  return (
    <>
      <div className="Header">
        <button onClick={() => navigate("/")}>home</button>
        <button onClick={() => navigate("/about/a")}>about/a</button>
        <button onClick={() => navigate("/event/100")}>event</button>
        {currentUser ? (
          <div>
            <span>{currentUser.displayName}</span>
            <button onClick={signOut}>Signout</button>
          </div>
        ) : (
          <button onClick={signIn}>Signin</button>
        )}
      </div>
      <Outlet />
    </>
  )
}

export default Layout
