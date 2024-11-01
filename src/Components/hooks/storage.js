import { useState, useEffect } from 'react';
import { storageApp, firestoreApp, timestamp } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
const useStorage = (data) => {
    const [ progress, setProgress ] = useState(0);
    const [ isCompleted, setCompleted] = useState(false);
    const [ isUploading, setUploading ] = useState(false);

    useState(() => {
        if (!data || isUploading) {
            return;
        }

        setUploading(true);

        const storageRef = ref(storageApp, data.itemImage.name);
        const collectionRef = collection(firestoreApp, 'auctions');
        const uploadTask = uploadBytesResumable(storageRef, data.itemImage);

        uploadTask.on('state_changed', (snapshot) => {
            let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(percentage);
        },
        (error) => {
            console.log(error);
            setUploading(false);
        },
        async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            const createdAt = timestamp();
            delete data.itemImage;

            await addDoc(collectionRef, { ...data, createdAt, url });
            setCompleted(true);
            setUploading(false);
        });
    }, [data, isUploading]);

    return { progress, isCompleted };
}

export default useStorage;