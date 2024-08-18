import { useLists } from "@/firebase/useTask"
import { useOutletContext } from "react-router-dom"
import { LayoutOutletContext } from "./Layout"
import TasksPage from "./TasksPage"

function ListPage() {
  const { isDebug } = useOutletContext<LayoutOutletContext>()
  const { data: lists, isLoading, error } = useLists()

  if (error) {
    console.error(error)
    return <div>Error: {error.message}</div>
  }

  if (isLoading || !lists) {
    return <div>Loading...</div>
  }

  return (
    <>
      {lists.map((list) => (
        <div
          key={list.uid}
          className="flex flex-col gap-4 border p-2 md:p-4 rounded-sm"
        >
          <h2 className="text-xl">
            {list.title} {isDebug && `[${list.uid}]`}
          </h2>
          <TasksPage list={list} />
        </div>
      ))}
    </>
  )
}

export default ListPage
