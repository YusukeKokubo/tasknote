import { collection, doc } from "firebase/firestore";
import { useFirestore } from "./useFirestore";
import { db } from "@/main";

type Issue = { uid: string, id: string, title: string };

export const useIssue = (uid: string | undefined) => {
	const fireUser = useFirestore<Issue>(uid ? doc(collection(db, 'issues'), uid) : undefined);

	return fireUser;
};

export const useIssues = () => {

	const fireUsers = useFirestore<Issue[]>(collection(db, 'issues'));
	console.log(fireUsers);

	return fireUsers;
}
