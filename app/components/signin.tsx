"use client"

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signin() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/signin", formData);
            const { token } = response.data;
            localStorage.setItem("token", token);
            router.push("/dashboard");
        } catch (error: any) {
            if (error.response) {
                alert(error.response.data.message);
            } else {
                alert("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className="grid place-items-center h-screen ">
            <div className="shadow-md rounded-md text-center bg-slate-200 p-10">
                <h1 className="font-semibold text-lg">User Login</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <input type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    <input type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    <button className="bg-stone-400 rounded-md p-2" type="submit">Sign In</button>
                    <Link href={"/register"} className="text-[12px] text-right">
                        Don't have an account? <span className="text-blue-500 underline">Signup</span>
                    </Link>
                </form>
            </div>
        </div>
    );
}
