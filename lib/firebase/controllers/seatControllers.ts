import { addDoc, arrayRemove, arrayUnion, collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";

const seatCollection = collection(db, 'seats');

export async function addSeatBookings(showDetails: string, seatIds: number[]) {
    const q = query(seatCollection, where('showDetails', '==', showDetails));
    const querySnapshot = await getDocs(q);

    if(querySnapshot.empty) await addDoc(seatCollection, {showDetails, seatIds});
    else {
        const docRef = querySnapshot.docs[0].ref;

        await updateDoc(docRef, {
            seatIds: arrayUnion(...seatIds)
        });
    }
}

export async function getBookedSeats(showDetails: string) {
    const q = query(seatCollection, where('showDetails', '==', showDetails));
    const querySnapshot = await getDocs(q);

    if(querySnapshot.empty) return {seatIds: []};
    else {
        const doc = querySnapshot.docs[0];
        const seats = doc.data().seatIds;

        return {seatIds: seats};
    }
}

export async function removeSeatBookings(showDetails: string, seatIds: number[]) {
    const q = query(seatCollection, where('showDetails', '==', showDetails));
    const querySnapshot = await getDocs(q);

    if(!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;

        await updateDoc(docRef, {
            seatIds: arrayRemove(...seatIds)
        });
    }
}