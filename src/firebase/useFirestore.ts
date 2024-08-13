import { useEffect, useState } from 'react';

import { onSnapshot } from 'firebase/firestore';


import type { Query, DocumentReference, DocumentData, FirestoreError } from 'firebase/firestore';
import { formatDoc } from './format';

export const useFirestore = <T>(
	docOrQuery: Query<DocumentData> | DocumentReference | undefined
) => {
	const [firestore, setFirestore] = useState<{
		data: T | undefined;
		isLoading: boolean;
		error: FirestoreError | null;
	}>({
		data: undefined,
		isLoading: true,
		error: null,
	});

	useEffect(() => {
		if (!docOrQuery) {
			return;
		}
		setFirestore((prev) => ({ ...prev, isLoading: true }));
		let unsubscribe: () => void;
		if (docOrQuery.type === 'document') {
			unsubscribe = onSnapshot(docOrQuery as DocumentReference, {
				next(doc) {
					if (doc.exists()) {
						const updatedData = formatDoc(doc) as unknown as T;
						setFirestore({ data: updatedData, isLoading: false, error: null });
					} else {
						setFirestore((prev) => ({
							...prev,
							isLoading: false,
							error: {
								code: 'not-found',
								message: 'Document does not exist',
								name: 'FirestoreError',
							},
						}));
						unsubscribe;
					}
				},
				error(error) {
					setFirestore((prev) => ({ ...prev, isLoading: false, error: error }));
					unsubscribe;
				},
			});
		} else {
			unsubscribe = onSnapshot(docOrQuery as Query<DocumentData>, {
				next(snapshot) {
					const updatedData = snapshot.docs.map((doc) => formatDoc(doc)) as unknown as T;
					setFirestore({ data: updatedData, isLoading: false, error: null });
				},
				error(error) {
					setFirestore((prev) => ({ ...prev, isLoading: false, error: error }));
					unsubscribe;
				},
			});
		}
		return unsubscribe;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(docOrQuery)]);

	return firestore;
};
