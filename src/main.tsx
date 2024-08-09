import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./components/Layout.tsx"
import About from "./components/About.tsx"
import AboutA from "./components/AboutA.tsx"
import Event from "./components/Event.tsx"

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
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
