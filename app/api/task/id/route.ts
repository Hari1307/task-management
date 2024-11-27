import { NextResponse, NextRequest } from "next/server";
import { JWT_SECRET, prismaClient } from "../../lib/db";
import jwt from "jsonwebtoken";


export async function DELETE(req: NextRequest, { params }: { params: { id: number } }) {
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token)
        return NextResponse.json({ message: "Unauthorized to access this page" }, { status: 400 });

    try {
        const deletedTask = await prismaClient.task.delete({ where: { id: params.id } })
        return NextResponse.json({ message: "Deleted task successfully", task: deletedTask }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: "Error in deleting a Task", error: err.message }, { status: 500 });
    }
}