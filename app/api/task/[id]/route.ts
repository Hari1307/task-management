import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "../../lib/db";

export async function PUT(req: NextRequest) {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const id = pathSegments[pathSegments.length - 1]

    if (!id) {
        return NextResponse.json(
            { message: "No ID provided" },
            { status: 400 }
        )
    }

    const taskId = parseInt(id, 10)

    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token)
        return NextResponse.json({ message: "Unauthorized to access this page" }, { status: 400 });

    try {
        const { title, priority, startTime, endTime, status } = await req.json();

        const updatedTask = await prismaClient.task.update({
            where: { id: taskId },
            data: { title, priority, startTime, endTime, status }
        });

        return NextResponse.json({ message: "Updated task successfully", task: updatedTask }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: "Error in updating a Task", err }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const id = pathSegments[pathSegments.length - 1]

    if (!id) {
        return NextResponse.json(
            { message: "No ID provided" },
            { status: 400 }
        )
    }

    const taskId = parseInt(id, 10);

    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token)
        return NextResponse.json({ message: "Unauthorized to access this page" }, { status: 400 });

    try {
        const task = await prismaClient.task.findUnique({ where: { id: taskId } });

        if (!task) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        const deletedTask = await prismaClient.task.delete({ where: { id: taskId } })

        return NextResponse.json({ message: "Deleted task successfully", task: deletedTask }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: "Error in deleting a Task", err }, { status: 500 });
    }
}