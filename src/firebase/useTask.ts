import { collection, doc, setDoc } from "firebase/firestore";
import { useFirestore } from "./useFirestore";
import { db } from "@/main";

export type Task = { uid: string, userId: string, title: string, description: string, doneAt: Date | null, order: number };
export type TaskData = Pick<Task, 'title'>
export type TaskDoneData = Pick<Task, 'uid' | 'doneAt'>

export const useTask = (uid: string | undefined) => {
	const fireUser = useFirestore<Task>(uid ? doc(collection(db, 'issues'), uid) : undefined);

	return fireUser;
};

export const useTasks = () => {

	const tasks = useFirestore<Task[]>(collection(db, 'task'));

	return tasks;
}

export const createNewTask = async (task: TaskData) => {
	console.log('Save task', task);
	const taskRef = doc(collection(db, 'task'));
	setDoc(taskRef, task);
}

export const doneTask = async (task: TaskDoneData) => {
	const taskRef = doc(collection(db, 'task'), task.uid);
	setDoc(taskRef, task, { merge: true });
}
