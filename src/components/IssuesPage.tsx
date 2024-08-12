import { useIssues } from "@/firebase/getIssues"
import { css } from "@/styled-system/css"
import { useNavigate } from "react-router-dom"

function IssuesPage() {
  const { data: issues, isLoading } = useIssues()
  const navigate = useNavigate()

  return isLoading || !issues ? (
    <div>Loading...</div>
  ) : (
    <div>
      <h1>User Page</h1>
      <table className={css({ border: "1px" })}>
        <tbody>
          <tr>
            <th>id</th>
            <th>title</th>
          </tr>
          {issues.map((issue) => (
            <tr key={issue.uid}>
              <td>{issue.uid}</td>
              <td>{issue.title}</td>
              <td>
                <button
                  onClick={() => {
                    navigate(`/issues/${issue.uid}`)
                  }}
                >
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default IssuesPage
