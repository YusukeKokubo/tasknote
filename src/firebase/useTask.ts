import { auth, db } from "@/main";
import { collection, doc, getCountFromServer, orderBy, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { useFirestore } from "./useFirestore";

export type Task = { uid: string, userId: string, listId: string, title: string, doneAt: Date | null, order: number };
export type TaskInsertData = Pick<Task, 'listId' | 'title' | 'order'>
export type TaskUpdateData = Pick<Task, 'uid' | 'title'>
export type TaskDoneData = Pick<Task, 'uid'>

export type List = { uid: string, userId: string, title: string, note: string, order: number };
export type ListInsertData = Pick<List, 'title' | 'order'>
export type ListUpdateTitleData = Pick<List, 'uid' | 'title'>
export type ListUpdateNoteData = Pick<List, 'uid' | 'note'>

export const useTasks = (listId: List['uid']) => {
	const userId = auth.currentUser?.uid
	if (!userId) throw new Error('User is not signed in');
	const tasks = useFirestore<Task[]>(query(collection(db, 'task'), where('listId', '==', listId), where('archivedAt', '==', null), where('userId', '==', userId), orderBy('createdAt', 'asc')));
	return tasks;
}

export const createNewTask = async (task: TaskInsertData) => {
	const taskRef = doc(collection(db, 'task'));
	setDoc(taskRef, { ...task, userId: auth.currentUser?.uid, archivedAt: null, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export const updateTask = async (task: TaskUpdateData) => {
	const taskRef = doc(collection(db, 'task'), task.uid);
	setDoc(taskRef, { ...task, updatedAt: serverTimestamp() }, { merge: true });
}

export const doneTask = async (task: TaskDoneData) => {
	const taskRef = doc(collection(db, 'task'), task.uid);
	setDoc(taskRef, { doneAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
}

export const undoneTask = async (task: TaskDoneData) => {
	const taskRef = doc(collection(db, 'task'), task.uid);
	setDoc(taskRef, { doneAt: null, updatedAt: serverTimestamp() }, { merge: true });
}

export const archiveDoneTasks = async (doneTasks: TaskDoneData[]) => {
	doneTasks.forEach(task => {
		const taskRef = doc(collection(db, 'task'), task.uid);
		setDoc(taskRef, { archivedAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
	})
}

// List

export const useLists = () => {
	const userId = auth.currentUser?.uid
	if (!userId) throw new Error('User is not signed in');
	const lists = useFirestore<List[]>(query(collection(db, 'list'), where('userId', '==', userId), orderBy('order', 'asc')));
	return lists;
}

export const getListCount = (userId: string) => {
	const lists = getCountFromServer(query(collection(db, 'list'), where('userId', '==', userId)));
	return lists
}

export const createNewList = async (list: ListInsertData) => {
	const listRef = doc(collection(db, 'list'));
	if (!auth.currentUser) throw new Error('User is not signed in');
	setDoc(listRef, { ...list, userId: auth.currentUser.uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export const UpdateListTitle = async (list: ListUpdateTitleData) => {
	const listRef = doc(collection(db, 'list'), list.uid);
	setDoc(listRef, { ...list, updatedAt: serverTimestamp() }, { merge: true });
}

export const UpdateListNote = async (list: ListUpdateNoteData) => {
	const listRef = doc(collection(db, 'list'), list.uid);
	setDoc(listRef, { ...list, updatedAt: serverTimestamp() }, { merge: true });
}
