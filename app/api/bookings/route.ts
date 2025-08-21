import { addBooking, getBookings } from "@/lib/firebase/controllers/bookingControllers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const { email, seatNames, time, movieId, cinemaId, cost } = await req.json();

    try {
        await addBooking(email, seatNames, time, movieId, cinemaId, cost);
        return NextResponse.json({message: 'Booking Added.'}, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: 'Can`t add booking.'}, {status: 400});
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const email = searchParams.get('email');

    try {
        const bookings = await getBookings(email!);
        return NextResponse.json(bookings, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: 'Can`t fetch bookings.'}, {status: 400});
    }
}