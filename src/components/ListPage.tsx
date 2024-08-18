import {
  List,
  UpdateListNote,
  UpdateListTitle,
  useLists,
} from "@/firebase/useTask"
import { useOutletContext } from "react-router-dom"
import { LayoutOutletContext } from "./Layout"
import TasksPage from "./TasksPage"
import { AutosizeTextarea } from "./ui/autosize-textarea"
import { useId, useState } from "react"
import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Input } from "./ui/input"
import { VStack } from "./ui/v-stack"

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
    const [editingTitle, setEditingTitle] = useState(list.title)
    const [editingNote, setEditingNote] = useState(list.note)
    const titleFormId = useId()
    const noteFormId = useId()
    return (
      <div>
        <form id={titleFormId} onSubmit={(e) => e.preventDefault()} />
        <form id={noteFormId} onSubmit={(e) => e.preventDefault()} />
        <Card>
          <CardHeader className="bg-gray-100">
            <CardTitle>
              <VStack gap="sm">
                <Input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="text-2xl border-0 bg-transparent p-0 h-max"
                  form={titleFormId}
                />
                {list.title !== editingTitle && (
                  <Button
                    onClick={() => {
                      UpdateListTitle({ uid: list.uid, title: editingTitle })
                    }}
                    form={titleFormId}
                  >
                    Update
                  </Button>
                )}
              </VStack>
            </CardTitle>
            <CardDescription>
              {isDebug && <span className="text-gray-500">{list.uid}</span>}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <TasksPage list={list} />
          </CardContent>
          <CardFooter>
            <VStack gap="sm" className="w-full">
              <AutosizeTextarea
                value={editingNote}
                onChange={(e) => setEditingNote(e.target.value)}
                placeholder="Note for the list"
                className="text-lg"
                form={noteFormId}
              />
              {list.note !== editingNote && (
                <Button
                  onClick={() => {
                    UpdateListNote({ uid: list.uid, note: editingNote })
                  }}
                  type="submit"
                  form={noteFormId}
                >
                  Update
                </Button>
              )}
            </VStack>
          </CardFooter>
        </Card>
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
