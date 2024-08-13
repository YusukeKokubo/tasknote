import { saveTask, TaskData, useTasks } from "@/firebase/useTask"
import { useState } from "react"

function TasksPage() {
  const { data: tasks, isLoading } = useTasks()

  const [title, setTitle] = useState("")

  const addTask = (title: string) => {
    console.log("Add task")
    const taskData: TaskData = { title }
    saveTask(taskData)
    setTitle("")
  }

  return isLoading || !tasks ? (
    <div>Loading...</div>
  ) : (
    <div>
      <h1>Tasks</h1>
      <table className="border">
        <tbody>
          <tr>
            <th>title</th>
          </tr>
          {tasks.map((task) => (
            <tr key={task.uid}>
              <td>{task.title}</td>
            </tr>
          ))}
          <tr>
            <td>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(value) => setTitle(value.target.value)}
              />
            </td>
            <td>
              <button
                onClick={() => {
                  addTask(title)
                }}
              >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default TasksPage
