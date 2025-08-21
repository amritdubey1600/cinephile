import { getUserImage } from "@/lib/firebase/controllers/userControllers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    try {
        const userImage = await getUserImage(email!);
        return NextResponse.json({...userImage}, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error:'Can`t fetch image.'}, {status: 400});
    }
}