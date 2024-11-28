import { isBefore } from "date-fns";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { JWT_SECRET, prismaClient } from "../lib/db";

export async function POST(req: NextRequest) {
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token)
        return NextResponse.json({ message: "Unauthorized to access this page" }, { status: 400 });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { id } = decoded as { id: number };

        const { title, priority, startTime, endTime, status } = await req.json();

        if (!isBefore(startTime, endTime)) {
            return NextResponse.json({ error: "End time must be after start time" }, { status: 400 });
        }

        if (!title || !status || !startTime || !endTime || typeof priority !== "number") {
            return NextResponse.json({ message: "Invalid input data" }, { status: 400 });
        }

        if (priority < 1 || priority > 5) {
            return NextResponse.json({ message: "Priority must be between 1 and 5" }, { status: 400 });
        }

        if (!["Pending", "Finished"].includes(status)) {
            return NextResponse.json({ message: "Invalid status value" }, { status: 400 });
        }

        const task = await prismaClient.task.create({
            data:
            {
                title,
                startTime,
                endTime,
                status,
                priority,
                userId: id
            }
        })
        return NextResponse.json({ message: "Created Task Successfully", task }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ message: "Error in creating a Task", err }, { status: 500 });
    }
}
export async function GET(req: NextRequest) {
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token)
        return NextResponse.json({ message: "Unauthorized to access this page" }, { status: 400 });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { id } = decoded as { id: number };
        const tasks = await prismaClient.user.findUnique({ where: { id }, include: { tasks: true } });
        const task = tasks?.tasks;
        return NextResponse.json({ message: "fetched tasks successfully", task }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: "Error in getting Tasks", err }, { status: 500 });
    }
}