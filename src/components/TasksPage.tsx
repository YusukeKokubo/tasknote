import { useTasks } from "@/firebase/useTask"

function IssuesPage() {
  const { data: issues, isLoading } = useTasks()

  return isLoading || !issues ? (
    <div>Loading...</div>
  ) : (
    <div>
      <h1>Tasks</h1>
      <table className="border">
        <tbody>
          <tr>
            <th>id</th>
            <th>title</th>
          </tr>
          {issues.map((issue) => (
            <tr key={issue.uid}>
              <td>{issue.uid}</td>
              <td>{issue.title}</td>
            </tr>
          ))}
          <tr>
            <td></td>
            <td>
              <input type="text" />
            </td>
            <td>
              <button>Add</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default IssuesPage
