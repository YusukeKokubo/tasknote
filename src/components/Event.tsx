import { useParams } from "react-router-dom"

function Event() {
  const { id } = useParams()
  return <div>event {id}</div>
}

export default Event
