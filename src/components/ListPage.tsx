import { List, UpdateListNote, useLists } from "@/firebase/useTask"
import { useOutletContext } from "react-router-dom"
import { LayoutOutletContext } from "./Layout"
import TasksPage from "./TasksPage"
import { AutosizeTextarea } from "./ui/autosize-textarea"
import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

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
      <Card>
        <CardHeader>
          <CardTitle>{list.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {isDebug && <span className="text-gray-500">{list.uid}</span>}
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
        </CardContent>
      </Card>
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
