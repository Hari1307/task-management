import { JWT_SECRET, prismaClient } from "./lib/db";

import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token)
        return NextResponse.json({ message: "Unauthorized to access this page" }, { status: 400 });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
        const { id } = decoded;
        const user = await prismaClient.user.findUnique({ where: { id }, include: { tasks: true } })
        return NextResponse.json({ user }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: "invalid Token" }, { status: 401 });
    }
}