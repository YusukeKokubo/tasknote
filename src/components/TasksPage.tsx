import {
  archiveDoneTasks,
  createNewTask,
  doneTask,
  List,
  Task,
  TaskInsertData,
  TaskUpdateData,
  undoneTask,
  updateTask,
  useTasks,
} from "@/firebase/useTask"
import { PlusCircleIcon } from "lucide-react"
import { useState } from "react"
import { useOutletContext } from "react-router-dom"
import { LayoutOutletContext } from "./Layout"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Input } from "./ui/input"
import { VStack } from "./ui/v-stack"
import { HStack } from "./ui/h-stack"

const TasksPage: React.FC<{ list: List }> = ({ list }) => {
  const { isDebug } = useOutletContext<LayoutOutletContext>()
  const { data: tasks, isLoading, error } = useTasks(list.uid)

  if (error) {
    console.error(error)
    return <div>Error: {error.message}</div>
  }

  if (isLoading || !tasks) {
    return <div>Loading...</div>
  }

  const TaskRow: React.FC<{ task: Task }> = (props) => {
    const task = props.task
    const [editingTitle, setEditingTitle] = useState(task.title)

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
    return (
      <form
        key={task.uid}
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <HStack gap="sm" className="border-b">
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
          <VStack gap="sm" className="w-full">
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
          </VStack>
        </HStack>
      </form>
    )
  }

  const ArchiveButton: React.FC = () => {
    const archive = () => {
      const doneTasks = tasks?.filter((task) => !!task.doneAt)
      if (doneTasks) {
        archiveDoneTasks(doneTasks)
      }
    }
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
    const [title, setTitle] = useState("")

    const add = (title: string) => {
      const order = tasks.length + 1
      const listId = list.uid
      const taskData: TaskInsertData = { title, listId, order }
      createNewTask(taskData)
      setTitle("")
    }

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <VStack gap="sm">
          <HStack gap="sm" className="border-b">
            <PlusCircleIcon size={18} color="#666" />
            <Input
              type="text"
              name="title"
              className="border-0 text-lg px-1 rounded-none focus:rounded"
              placeholder="New task"
              value={title}
              onChange={(value) => setTitle(value.target.value)}
            />
          </HStack>
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
        </VStack>
      </form>
    )
  }

  return (
    <>
      <VStack gap="sm">
        {tasks.map((task) => (
          <TaskRow task={task} key={task.uid} />
        ))}
        {tasks.some((task) => !!task.doneAt) && <ArchiveButton />}
        <NewTaskForm />
      </VStack>
    </>
  )
}

export default TasksPage
