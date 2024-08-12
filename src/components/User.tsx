import { useIssues } from "@/firebase/IssueService"

function UserPage() {
  const issues = useIssues()
  return !issues ? (
    <div>Loading...</div>
  ) : (
    <div>
      <h1>User Page</h1>
      {issues.map((issue) => (
        <div key={issue.id}>
          <h2>{issue.title}</h2>
        </div>
      ))}
    </div>
  )
}

export default UserPage
