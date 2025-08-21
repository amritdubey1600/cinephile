import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const bookingCollection = collection(db, 'bookings');

export async function addBooking(email: string, seatNames: string, time: string, movieId: string, cinemaId: string, cost: number){
    await addDoc(bookingCollection,{
        email,
        seatNames,
        time,
        movieId,
        cinemaId,
        cost
    });
}

export async function getBookings(email: string) {
    const q = query(bookingCollection, where('email','==',email));
    const querySnapshot = await getDocs(q);

    if(querySnapshot.empty) return [];

    const bookings = querySnapshot.docs.map((doc) => ({
        bookingId: doc.id,
        ...doc.data()
    }));

    return bookings;
}

export async function deleteBooking(id: string) {
    await deleteDoc(doc(db,'bookings',id));
}