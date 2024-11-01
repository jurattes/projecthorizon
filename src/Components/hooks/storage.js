import { useState } from 'react';
import { storageApp, firestoreApp, timestamp } from '../config/firebase';
const useStorage = (data) => {
    const [ progress, setProgress ] = useState(0);
    const [ isCompleted, setCompleted] = useState(null);

    useState(() => {
        const storageRef = storageApp.ref(data.itemImage.name);
        const collectionRef = firestoreApp.collection('auction');

        storageRef.put(data.itemImage).on('state_changed', (snapshot) => {
            let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(percentage);
        },
        (error) => {
            console.log(error);
        },
        async () => {
            const url = await storageRef.getDownloadURL();
            const createdAt = timestamp();
            delete data.itemImage;
            await collectionRef.add({ ...data, createdAt, url });
            setCompleted(true);
        });
    }, [data]);

    return { progress, isCompleted };
}

export default useStorage;