import {
  createNewTask,
  doneTask,
  Task,
  TaskData,
  undoneTask,
  useTasks,
} from "@/firebase/useTask"
import { useState } from "react"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Input } from "./ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import clsx from "clsx"

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
    doneTask({ uid: task.uid })
  }
  const undone = (task: Task) => {
    undoneTask({ uid: task.uid })
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
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.uid}>
              <TableCell>
                <Checkbox
                  checked={!!task.doneAt}
                  onCheckedChange={(checked) => {
                    checked ? done(task) : undone(task)
                  }}
                />
              </TableCell>
              <TableCell>
                <span
                  className={clsx(
                    task.doneAt && "line-through text-gray-500",
                    "text-lg"
                  )}
                >
                  {task.title}
                </span>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell></TableCell>
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
                disabled={!title}
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
