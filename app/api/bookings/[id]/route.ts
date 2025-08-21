import { deleteBooking } from "@/lib/firebase/controllers/bookingControllers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    req: NextRequest, 
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: bookingId } = await params;

    try {
        await deleteBooking(bookingId);
        return NextResponse.json({ message: 'Booking deleted.' }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error in deleting booking.' }, { status: 400 });
    }
}