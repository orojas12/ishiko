"use client";

import Cookies from "js-cookie";
import { FormEvent, MutableRefObject, useRef, useState } from "react";

export default function Login() {
    const formRef = useRef(null) as MutableRefObject<HTMLFormElement | null>;
    const [error, setError] = useState("");

    return (
        <>
            <h1>Please log in to continue</h1>
            <form
                className="flex flex-col"
                ref={formRef}
                onSubmit={async (e: FormEvent) => {
                    e.preventDefault();
                    setError("");
                    const data = new FormData(formRef.current as any);
                    const res = await fetch("/api/auth/signin", {
                        method: "POST",
                        headers: {
                            "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") as string,
                        },
                        body: new URLSearchParams(data as any),
                    });
                    const body = await res.json();
                    if (!res.ok) {
                        setError(body.message);
                    }
                }}
            >
                <p className="text-red-600">{error}</p>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" />
                <button>Submit</button>
            </form>
        </>
    );
}
