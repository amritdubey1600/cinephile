import { addDoc, collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import bcrypt from 'bcrypt';

const userCollection = collection(db, 'users');

export async function addUser(name: string, email: string, password: string, image: string) {
    const docRef = await addDoc(userCollection, {name, email, password, image});
    const docSnap = await getDoc(docRef);

    return { ...docSnap.data() }; // return added user
}

export async function getUser(email: string) {
    const q = query(userCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if(querySnapshot.empty) return null;

    return querySnapshot.docs[0].data(); // return user
}

// verifyUser func must not be used in the client side as it uses bcrypt(bulky & heavy) which makes the client-side slower
export async function verifyUser(email: string, password: string){
    const q = query(userCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if(querySnapshot.empty) return null;

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    const isMatch = await bcrypt.compare(password, userData.password);
    if(!isMatch) return null;

    return userData; // return user
}

export async function getUserImage(email: string) {
    const q = query(userCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if(querySnapshot.empty) return null;

    const userData = querySnapshot.docs[0].data();

    return { image: userData.image };
}