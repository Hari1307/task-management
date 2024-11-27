import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const router = useRouter();
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/");
                return;
            }

            try {
                const response = await axios.get("/api/", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.data) {
                    setUser(response.data);

                }
                else {
                    setError("something went wrong");

                }
            } catch (err) {
                // setError("");
            }
        }
    }, [router]);


    return (
        <div>
            <h1>Dashboard</h1>
            {user ?? (
                <div>
                    {user}
                </div>
            )}
            {error}
        </div>
    )
}