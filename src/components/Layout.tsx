import { auth } from "@/main"
import { FirebaseError } from "firebase/app"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu"
import { createNewList, getListCount } from "@/firebase/useTask"

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
        ;(async () => {
          const listCount = await getListCount(user.uid)
          if (listCount.data().count === 0) {
            console.log("No list found. Create a new list.")
          }
          createNewList({ title: "Inbox", note: "", order: 0 })
        })()
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
    <div className="p-2 md:p-4 flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-xl">Tasks&Notes</h1>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      <div className="flex items-center gap-1">
                        {currentUser.photoURL ? (
                          <img
                            src={currentUser.photoURL}
                            alt={currentUser.displayName || "User"}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <span className="w-8 h-8 rounded-full bg-gray-300 block" />
                        )}
                        {currentUser.displayName}
                      </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="flex flex-col">
                        {debug && <span>[{currentUser.uid}]</span>}
                        <NavigationMenuLink>
                          <Button variant="link" onClick={signOut}>
                            Signout
                          </Button>
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </>
          ) : (
            <Button onClick={signIn}>Signin</Button>
          )}
        </div>
      </div>
      {currentUser && <Outlet context={{ isDebug: debug }} />}
      <div className="fixed right-2 bottom-10">
        <div className="p-2 rounded border flex items-center gap-2">
          <label htmlFor="isDebug">Debug</label>
          <Switch
            id="isDebug"
            checked={debug}
            onCheckedChange={(checked) => setDebug(checked ? true : false)}
          />
        </div>
      </div>
    </div>
  )
}

export default Layout
