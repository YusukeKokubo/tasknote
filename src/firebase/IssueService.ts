import { db } from "@/main";
import { collection, CollectionReference, doc, DocumentReference, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export interface Issue {
	id: string;
	title: string;
}

export const useIssue = (id: string) => {
	const [issue, setIssue] = useState<Issue>();
	const content = (id: string) => doc(db, "issues", id) as DocumentReference<Issue>;

	useEffect(() => {
		const unsubscribe = onSnapshot(content(id), (doc) => {
			return setIssue(doc.data());
		})

		return unsubscribe;
	}, [id])

	return issue;
}

export const useIssues = () => {
	const [issues, setIssues] = useState<Issue[]>();
	const contents = () => collection(db, "issues") as CollectionReference<Issue>;

	useEffect(() => {
		const unsubscribe = onSnapshot((contents()), (doc) => {
			return setIssues(doc.docs.map((doc) => doc.data()));
		})

		return unsubscribe;
	}, [])

	return issues;
}
