import { useState } from "react"
import { Outlet } from "react-router-dom"

function About() {
  const [count, setCount] = useState(0)
  return (
    <div>
      about
      <button onClick={() => setCount((count) => count + 1)}>click</button>
      <Outlet context={count} />
    </div>
  )
}

export default About
