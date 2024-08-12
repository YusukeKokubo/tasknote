import { FirebaseError } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { css } from "@/styled-system/css"

function Layout() {
  const navigate = useNavigate()
  const auth = getAuth()
  const [currentUser, setCurrentUser] = useState(auth.currentUser)
  const [count, setCount] = useState(0)

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
      <div className={css({ display: "flex", gap: 4 })}>
        <button onClick={() => navigate("/")}>home</button>
        <button onClick={() => navigate("/about/a")}>about/a</button>
        <button onClick={() => navigate("/event/100")}>event</button>
        <button onClick={() => navigate("/issues")}>issues</button>
        {currentUser ? (
          <div>
            <span>{currentUser.displayName}</span>
            <button onClick={signOut}>Signout</button>
          </div>
        ) : (
          <button onClick={signIn}>Signin</button>
        )}
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <Outlet context={{ headerCount: count }} />
    </>
  )
}

export default Layout
