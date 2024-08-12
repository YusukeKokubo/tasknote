import { useIssue } from "@/firebase/getIssues"
import { useParams } from "react-router-dom"

function IssuePage() {
  const { id } = useParams()
  console.log(id)
  const { data: issue, isLoading, error } = useIssue(id)
  console.log(error)

  return isLoading || !issue ? (
    <div>Loading...</div>
  ) : (
    <div>
      <div>{issue.title}</div>
    </div>
  )
}

export default IssuePage
