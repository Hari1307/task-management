import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "../lib/db";

export async function POST(req: NextRequest) {
    const { name, email, password } = await req.json();
    try {
        const isUserExist = await prismaClient.user.findUnique({ where: { email } });

        if (isUserExist) {
            return NextResponse.json({ message: "user already exist" }, { status: 400 });
        }

        const encryptPassword = await bcrypt.hash(password, 10);

        const user = await prismaClient.user.create({ data: { name, email, password: encryptPassword } });

        return NextResponse.json({ message: "User is Registered successfully", user }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ message: "internal server error", error: err }, { status: 500 });
    }
}