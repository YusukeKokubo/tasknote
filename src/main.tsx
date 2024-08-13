import { initializeApp } from "firebase/app"
import "firebase/auth"
import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import App from "./App.tsx"
import About from "./components/About.tsx"
import AboutA from "./components/AboutA.tsx"
import Event from "./components/Event.tsx"
import Layout from "./components/Layout.tsx"
import IssuesPage from "./components/IssuesPage.tsx"
import { connectAuthEmulator, getAuth } from "firebase/auth"
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore"
import IssuePage from "./components/IssuePage.tsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "about",
        element: <About />,
        children: [
          {
            path: "a",
            element: <AboutA />,
          },
        ],
      },
      {
        path: "event/:id",
        element: <Event />,
      },
      {
        path: "issues",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <IssuesPage />,
          },
          {
            path: ":id",
            element: <IssuePage />,
          }
        ]
      },
    ],
  },
])

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
}

const firebase = initializeApp(firebaseConfig)
const auth = getAuth()
const db = getFirestore()

if (import.meta.env.MODE === "development") {
  connectAuthEmulator(auth, "http://localhost:9099")
  connectFirestoreEmulator(db, "localhost", 8080)
}

export { firebase, auth, db }

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
