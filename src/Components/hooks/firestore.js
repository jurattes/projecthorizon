import React, { useEffect, useState } from 'react';
import { firestoreApp } from '../config/firebase';
import { collection, onSnapshot} from 'firebase/firestore';
export const useFirestore = (collectionName) => {
    const [ docs, setDocs ] = useState([]);

    useEffect(() => {
        const collectionRef = collection(firestoreApp, collectionName)
        const sub = onSnapshot(collectionRef, (snapshot) => {
            const documents = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            }))
            setDocs(documents);
        });
        return () => sub();
    }, [collectionName]);
    return { docs }
}