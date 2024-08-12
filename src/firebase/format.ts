import { default as dayjs } from 'dayjs';

import type { Timestamp, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

// 実際に画面に表示させる時に使う
export const formatDate = (date: string | number | Date | dayjs.Dayjs) =>
	dayjs(date).format('MMMM D, YYYY h:mm A');

export const timestampToDate = (timestamp: Timestamp) => {
	return timestamp ? timestamp.toDate() : new Date(0);
};

export const formatDoc = (doc: QueryDocumentSnapshot<DocumentData>) => {
	console.log('foramtDoc', doc)
	const data = doc.data();
	const formatedData = { uid: doc.id, ...data } as any;

	'createdAt' in data && (formatedData.createdAt = timestampToDate(data.createdAt));
	'updatedAt' in data && (formatedData.updatedAt = timestampToDate(data.updatedAt));
	return formatedData;
};
