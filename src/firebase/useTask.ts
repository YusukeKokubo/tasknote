import { db } from "@/main";
import { collection, doc, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { useFirestore } from "./useFirestore";

export type Task = { uid: string, userId: string, title: string, description: string, doneAt: Date | null, order: number };
export type TaskData = Pick<Task, 'title'>
export type TaskDoneData = Pick<Task, 'uid'>

export const useTask = (uid: string | undefined) => {
	const fireUser = useFirestore<Task>(uid ? doc(collection(db, 'issues'), uid) : undefined);

	return fireUser;
};

export const useTasks = () => {
	const tasks = useFirestore<Task[]>(query(collection(db, 'task'), orderBy('createdAt', 'asc')));
	return tasks;
}

export const createNewTask = async (task: TaskData) => {
	console.log('Save task', task);
	const taskRef = doc(collection(db, 'task'));
	setDoc(taskRef, { ...task, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export const doneTask = async (task: TaskDoneData) => {
	const taskRef = doc(collection(db, 'task'), task.uid);
	setDoc(taskRef, { task, doneAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
}

export const undoneTask = async (task: TaskDoneData) => {
	const taskRef = doc(collection(db, 'task'), task.uid);
	setDoc(taskRef, { task, doneAt: null, updatedAt: serverTimestamp() }, { merge: true });
}
