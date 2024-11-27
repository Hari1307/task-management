import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "../../lib/db";


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token)
        return NextResponse.json({ message: "Unauthorized to access this page" }, { status: 400 });

    try {
        const taskId = parseInt(params.id, 10);

        const task = await prismaClient.task.findUnique({ where: { id: taskId } });
        if (!task) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        const deletedTask = await prismaClient.task.delete({ where: { id: taskId } })

        return NextResponse.json({ message: "Deleted task successfully", task: deletedTask }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: "Error in deleting a Task", err }, { status: 500 });
    }
}