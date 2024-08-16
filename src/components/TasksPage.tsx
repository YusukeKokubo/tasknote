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

function TasksPage() {
  const { isDebug } = useOutletContext<LayoutOutletContext>()
  const { data: tasks, isLoading, error } = useTasks()
  const [title, setTitle] = useState("")

  if (error) {
    console.error(error)
    return <div>Error: {error.message}</div>
  }

  if (isLoading || !tasks) {
    return <div>Loading...</div>
  }

  const add = (title: string) => {
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
    if (doneTasks) {
      archiveDoneTasks(doneTasks)
    }
  }

  const TaskRow: React.FC<{ task: Task }> = (props) => {
    const task = props.task
    const [editingTitle, setEditingTitle] = useState(task.title)
    return (
      <form
        key={task.uid}
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <div className="flex items-center gap-2 border-b">
          <Checkbox
            checked={!!task.doneAt}
            onCheckedChange={(checked) => {
              if (checked) {
                done(task)
              } else {
                undone(task)
              }
            }}
          />
          <div className="flex flex-col gap-2 w-full">
            {task.doneAt ? (
              <span className="line-through text-gray-500 text-lg py-2">
                {task.title}
              </span>
            ) : (
              <Input
                type="text"
                name="title"
                value={editingTitle}
                className="border-0 text-lg p-0"
                onChange={(value) => {
                  setEditingTitle(value.target.value)
                }}
              />
            )}
            {isDebug && <span>[{task.uid}]</span>}
            {task.title !== editingTitle && (
              <Button
                onClick={() => {
                  update(task.uid, editingTitle)
                }}
                type="submit"
              >
                Update
              </Button>
            )}
          </div>
        </div>
      </form>
    )
  }

  const ArchiveButton: React.FC = () => {
    return (
      <Button
        variant="destructive"
        onClick={() => archive()}
        className="w-full"
      >
        Archive done tasks
      </Button>
    )
  }

  const NewTaskForm: React.FC = () => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            name="title"
            className="border-0 border-b text-lg rounded-none focus:rounded"
            placeholder="New task"
            value={title}
            onChange={(value) => setTitle(value.target.value)}
          />
          {title && (
            <Button
              onClick={() => {
                add(title)
              }}
              disabled={!title}
            >
              Add
            </Button>
          )}
        </div>
      </form>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskRow task={task} key={task.uid} />
        ))}
      </div>
      {tasks.some((task) => !!task.doneAt) && <ArchiveButton />}
      <NewTaskForm />
    </>
  )
}

export default TasksPage
