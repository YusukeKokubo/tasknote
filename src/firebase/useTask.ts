import { collection, doc, setDoc } from "firebase/firestore";
import { useFirestore } from "./useFirestore";
import { db } from "@/main";

type Task = { uid: string, userId: string, title: string, description: string, doneAt: Date, order: number };

export const useTask = (uid: string | undefined) => {
	const fireUser = useFirestore<Task>(uid ? doc(collection(db, 'issues'), uid) : undefined);

	return fireUser;
};

export const useTasks = () => {

	const tasks = useFirestore<Task[]>(collection(db, 'task'));

	return tasks;
}

export const saveTask = async (task: Task) => {
	const taskRef = doc(collection(db, 'task'));
	setDoc(taskRef, task);
}
