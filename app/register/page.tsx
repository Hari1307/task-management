"use client"

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/signin", formData);
            const { token } = response.data;
            localStorage.setItem("token", token);
            router.push("/");
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
                <h1 className="font-semibold text-lg">User Registration</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <input type="name" placeholder="Name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    <input type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    <input type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    <button className="bg-stone-400 rounded-md p-2" type="submit">Sign Up</button>
                    <Link href={"/"} className="text-[12px] text-right">
                        Already have an account? <span className="text-blue-500 underline">Signin</span>
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default Signup