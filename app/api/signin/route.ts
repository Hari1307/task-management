import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { JWT_SECRET, prismaClient } from "../lib/db";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    const user = await prismaClient.user.findUnique({ where: { email } });

    if (!user)
        return NextResponse.json({ message: "User not found, please sign up" }, { status: 400 });

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
        return NextResponse.json({ message: "incorrect password" }, { status: 401 });


    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    return NextResponse.json({ token }, { status: 200 });
}