import React, { useEffect} from 'react';
import { motion } from 'framer-motion';
import useStorage from '../hooks/storage';

export const Progression = ({ auction, setAuction }) => {
    const { progress, isCompleted } = useStorage(auction);

    useEffect(() => {
        if (isCompleted) {
            setAuction(null);
        }
    }, [isCompleted, setAuction]);

    const progressVariants = {
        initial: {
            width: '0%'},
        animate: {
            width: `${progress}%`},
    };
    return (
        <motion.div
            style={{ height: '5px', background: 'black' }}
            variants={progressVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
    )
};