"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();

    function logout() {
        localStorage.removeItem("token");
        router.push("/login");
    }

    return (
        <nav className="w-full bg-yellow-300 shadow p-4 flex items-center justify-between">
            <h1
                className="text-xl font-bold cursor-pointer"
                onClick={() => router.push("/")}
            >
                Notes App
            </h1>

            <div className="flex gap-4">
                <button
                    onClick={() => router.push("/")}
                    className="px-4 py-1 bg-white rounded-md shadow"
                >
                    Notes
                </button>

                <button
                    onClick={() => router.push("/archive")}
                    className="px-4 py-1 bg-white rounded-md shadow"
                >
                    Archive
                </button>

                <button
                    onClick={() => router.push("/shared")}
                    className="px-4 py-1 bg-white rounded-md shadow"
                >
                    Shared With Me
                </button>

                <button
                    onClick={logout}
                    className="px-4 py-1 bg-red-500 text-white rounded-md shadow"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}