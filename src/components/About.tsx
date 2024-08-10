import { useState } from "react"
import { Outlet, useOutletContext } from "react-router-dom"

function About() {
  const { headerCount } = useOutletContext<{ headerCount: number }>()
  const [count, setCount] = useState(headerCount)
  return (
    <div>
      about
      <button onClick={() => setCount((count) => count + 1)}>click</button>
      <Outlet context={count} />
    </div>
  )
}

export default About
