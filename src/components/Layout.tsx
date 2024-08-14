import { auth } from "@/main"
import { FirebaseError } from "firebase/app"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { Button } from "./ui/button"

function Layout() {
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
    })

    return unsubscribe
  }, [])

  return (
    <div className="p-8 flex flex-col gap-4">
      <>
        {currentUser ? (
          <div className="flex items-center gap-2">
            <span>{currentUser.displayName}</span>
            <Button variant="ghost" onClick={signOut}>
              Signout
            </Button>
          </div>
        ) : (
          <Button onClick={signIn}>Signin</Button>
        )}
      </>
      <Outlet />
    </div>
  )
}

export default Layout
