import { addUser, getUser } from "@/lib/firebase/controllers/userControllers";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
    const { name, email, password, image } = await req.json();

    const exists = await getUser(email);
    if(exists) return NextResponse.json({error: 'Email in use.'}, {status: 400});

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await addUser(name, email, hashedPassword, image);

    return NextResponse.json(user, {status: 200});
}