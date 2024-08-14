import {
  archiveDoneTasks,
  createNewTask,
  doneTask,
  Task,
  TaskData,
  TaskUpdateData,
  undoneTask,
  updateTask,
  useTasks,
} from "@/firebase/useTask"
import { useState } from "react"
import { useOutletContext } from "react-router-dom"
import { LayoutOutletContext } from "./Layout"
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

function TasksPage() {
  const { isDebug } = useOutletContext<LayoutOutletContext>()
  const { data: tasks, isLoading } = useTasks()
  const [title, setTitle] = useState("")

  const add = (title: string) => {
    console.log("Add task")
    const taskData: TaskData = { title }
    createNewTask(taskData)
    setTitle("")
  }

  const update = (uid: string, title: string) => {
    const taskData: TaskUpdateData = { uid, title }
    updateTask(taskData)
  }

  const done = (task: Task) => {
    doneTask({ uid: task.uid })
  }
  const undone = (task: Task) => {
    undoneTask({ uid: task.uid })
  }
  const archive = () => {
    const doneTasks = tasks?.filter((task) => !!task.doneAt)
    doneTasks && archiveDoneTasks(doneTasks)
  }

  const TaskRow: React.FC<{ task: Task }> = (props) => {
    const task = props.task
    const [editingTitle, setEditingTitle] = useState(task.title)
    const formId = `TaskForm-${task.uid}`
    return (
      <TableRow key={task.uid}>
        <TableCell>
          <Checkbox
            checked={!!task.doneAt}
            onCheckedChange={(checked) => {
              checked ? done(task) : undone(task)
            }}
            form={formId}
          />
        </TableCell>
        <TableCell>
          {task.doneAt ? (
            <span className="line-through text-gray-500 text-lg">
              {task.title}
            </span>
          ) : (
            <Input
              type="text"
              name="title"
              value={editingTitle}
              form={formId}
              className="border-0 text-lg"
              onChange={(value) => {
                setEditingTitle(value.target.value)
              }}
            />
          )}
          {isDebug && <span>[{task.uid}]</span>}
        </TableCell>
        <TableCell>
          {task.title !== editingTitle && (
            <Button
              onClick={() => {
                console.log("Update task", task.uid, editingTitle)
                update(task.uid, editingTitle)
              }}
              type="submit"
              form={formId}
            >
              Update
            </Button>
          )}
        </TableCell>
      </TableRow>
    )
  }

  return isLoading || !tasks ? (
    <div>Loading...</div>
  ) : (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1">Done</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-1"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TaskRow task={task} key={task.uid} />
          ))}
          {tasks.some((task) => !!task.doneAt) && (
            <TableRow>
              <TableCell></TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => archive()}>
                  Archive done tasks
                </Button>
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell></TableCell>
            <TableCell className="p-1">
              <Input
                type="text"
                name="title"
                value={title}
                form="NewTaskForm"
                onChange={(value) => setTitle(value.target.value)}
              />
            </TableCell>
            <TableCell>
              <Button
                form="NewTaskForm"
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
      {tasks.map((task) => (
        <form
          key={task.uid}
          id={`TaskForm-${task.uid}`}
          onSubmit={(e) => {
            e.preventDefault()
          }}
        ></form>
      ))}
      <form
        id="NewTaskForm"
        onSubmit={(e) => {
          e.preventDefault()
        }}
      ></form>
    </>
  )
}

export default TasksPage
