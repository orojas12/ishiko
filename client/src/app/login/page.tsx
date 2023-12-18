"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
    return (
        <>
            <h1>Please log in to continue</h1>
            <a href="/auth/login">Log in</a>
        </>
    );
}
