import { auth, db } from "@/main";
import { collection, doc, orderBy, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { useFirestore } from "./useFirestore";

export type Task = { uid: string, userId: string, title: string, doneAt: Date | null, order: number };
export type TaskInsertData = Pick<Task, 'title' | 'order'>
export type TaskUpdateData = Pick<Task, 'uid' | 'title'>
export type TaskDoneData = Pick<Task, 'uid'>

export const useTasks = () => {
	const userId = auth.currentUser?.uid
	if (!userId) throw new Error('User is not signed in');
	const tasks = useFirestore<Task[]>(query(collection(db, 'task'), where('archivedAt', '==', null), where('userId', '==', userId), orderBy('createdAt', 'asc')));
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
