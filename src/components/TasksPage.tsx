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
    doneTasks && archiveDoneTasks(doneTasks)
  }

  const TaskRow: React.FC<{ task: Task }> = (props) => {
    const task = props.task
    const [editingTitle, setEditingTitle] = useState(task.title)
    const formId = `TaskForm-${task.uid}`
    return (
      <div className="flex items-center gap-2 border-b">
        <Checkbox
          checked={!!task.doneAt}
          onCheckedChange={(checked) => {
            checked ? done(task) : undone(task)
          }}
          form={formId}
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
              form={formId}
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
              form={formId}
            >
              Update
            </Button>
          )}
        </div>
      </div>
    )
  }

  return isLoading || !tasks ? (
    <div>Loading...</div>
  ) : (
    <>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskRow task={task} key={task.uid} />
        ))}
      </div>
      {tasks.some((task) => !!task.doneAt) && (
        <div>
          <Button
            variant="destructive"
            onClick={() => archive()}
            className="w-full"
          >
            Archive done tasks
          </Button>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <Input
          type="text"
          name="title"
          placeholder="New task"
          value={title}
          form="NewTaskForm"
          onChange={(value) => setTitle(value.target.value)}
        />
        <Button
          form="NewTaskForm"
          onClick={() => {
            add(title)
          }}
          disabled={!title}
        >
          Add
        </Button>
      </div>
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
