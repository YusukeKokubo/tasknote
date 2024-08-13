import {
  createNewTask,
  doneTask,
  Task,
  TaskData,
  TaskDoneData,
  useTasks,
} from "@/firebase/useTask"
import { useState } from "react"
import { Button } from "./ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Input } from "./ui/input"
import { Checkbox } from "./ui/checkbox"

function TasksPage() {
  const { data: tasks, isLoading } = useTasks()

  const [title, setTitle] = useState("")

  const add = (title: string) => {
    console.log("Add task")
    const taskData: TaskData = { title }
    createNewTask(taskData)
    setTitle("")
  }

  const done = (task: Task) => {
    console.log("Done task")
    const taskData: TaskDoneData = { uid: task.uid, doneAt: new Date() }
    doneTask(taskData)
  }
  const undone = (task: Task) => {
    console.log("Undone task")
    const taskData: TaskDoneData = { uid: task.uid, doneAt: null }
    doneTask(taskData)
  }

  return isLoading || !tasks ? (
    <div>Loading...</div>
  ) : (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.uid}>
              <TableCell>{task.title}</TableCell>
              <TableCell>
                <Checkbox
                  checked={!!task.doneAt}
                  onCheckedChange={(checked) => {
                    checked ? done(task) : undone(task)
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell className="p-1">
              <Input
                type="text"
                name="title"
                value={title}
                onChange={(value) => setTitle(value.target.value)}
              />
            </TableCell>
            <TableCell>
              <Button
                onClick={() => {
                  add(title)
                }}
              >
                Add
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  )
}

export default TasksPage
