import { auth } from "@/main"
import { FirebaseError } from "firebase/app"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"

export type LayoutOutletContext = {
  isDebug: boolean
}

function Layout() {
  const [currentUser, setCurrentUser] = useState(auth.currentUser)
  const [debug, setDebug] = useState(false)

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
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl">Tasks and Notes</h1>
          <div className="p-2 rounded border flex items-center gap-2">
            <label htmlFor="isDebug">Debug</label>
            <Switch
              id="isDebug"
              checked={debug}
              onCheckedChange={(checked) => setDebug(checked ? true : false)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              <span>{currentUser.displayName}</span>
              {debug && <span>[{currentUser.uid}]</span>}
              <Button variant="ghost" onClick={signOut}>
                Signout
              </Button>
            </>
          ) : (
            <Button onClick={signIn}>Signin</Button>
          )}
        </div>
      </div>
      {currentUser && <Outlet context={{ isDebug: debug }} />}
    </div>
  )
}

export default Layout
