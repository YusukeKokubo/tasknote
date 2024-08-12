import { collection, doc } from "firebase/firestore";
import { useFirestore } from "./useFirestore";
import { db } from "@/main";

type FireUser = { id: string };

export const useFireUser = (uid: string | undefined) => {
	const fireUser = useFirestore<FireUser>(uid ? doc(collection(db, 'users'), uid) : undefined);

	return fireUser;
};

export const useFireUsers = () => {

	const fireUsers = useFirestore<FireUser[]>(collection(db, 'users'));
	console.log("fireUsers", fireUsers);



	return fireUsers;
}
