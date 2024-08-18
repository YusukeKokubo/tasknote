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
import { VStack } from "./ui/v-stack"
import { HStack } from "./ui/h-stack"

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
          createNewList({ title: "Inbox", order: 0 })
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
    <VStack gap="lg" className="p-2 md:p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl">bibozu</h1>

        <HStack gap="sm">
          {currentUser ? (
            <>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      <HStack gap="sm">
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
                      </HStack>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <VStack gap="sm">
                        {debug && <span>[{currentUser.uid}]</span>}
                        <NavigationMenuLink>
                          <Button variant="link" onClick={signOut}>
                            Signout
                          </Button>
                        </NavigationMenuLink>
                      </VStack>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </>
          ) : (
            <Button onClick={signIn}>Signin</Button>
          )}
        </HStack>
      </div>
      {currentUser && <Outlet context={{ isDebug: debug }} />}
      <div className="fixed right-2 bottom-10">
        <HStack gap="sm" className="p-2 rounded border">
          <label htmlFor="isDebug">Debug</label>
          <Switch
            id="isDebug"
            checked={debug}
            onCheckedChange={(checked) => setDebug(checked ? true : false)}
          />
        </HStack>
      </div>
    </VStack>
  )
}

export default Layout
