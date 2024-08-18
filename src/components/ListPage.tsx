import { List, UpdateListNote, useLists } from "@/firebase/useTask"
import { useOutletContext } from "react-router-dom"
import { LayoutOutletContext } from "./Layout"
import TasksPage from "./TasksPage"
import { AutosizeTextarea } from "./ui/autosize-textarea"
import { useState } from "react"
import { Button } from "./ui/button"

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

  const ListCard: React.FC<{ list: List }> = ({ list }) => {
    const [editingNote, setEditingNote] = useState(list.note)
    return (
      <div className="flex flex-col gap-4 border p-2 md:p-4 rounded-sm">
        <h2 className="text-xl font-bold">{list.title}</h2>
        {isDebug && `[${list.uid}]`}
        <TasksPage list={list} />
        <AutosizeTextarea
          value={editingNote}
          onChange={(e) => setEditingNote(e.target.value)}
          placeholder="Note for the list"
          className="text-lg mt-4"
        />
        {list.note !== editingNote && (
          <Button
            onClick={() => {
              UpdateListNote({ uid: list.uid, note: editingNote })
            }}
            type="submit"
          >
            Update
          </Button>
        )}
      </div>
    )
  }

  return (
    <>
      {lists.map((list) => (
        <ListCard key={list.uid} list={list} />
      ))}
    </>
  )
}

export default ListPage
