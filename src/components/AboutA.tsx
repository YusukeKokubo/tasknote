import { useOutletContext } from "react-router-dom"

function AboutA() {
  const count = useOutletContext<number>()
  return <div>count: {count}</div>
}

export default AboutA
