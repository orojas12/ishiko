import { Link } from "@/components/ui/link";
import { sessionManager } from "@/lib";
import { redirect } from "next/navigation";

export default async function Home() {
    const session = await sessionManager.validateSession();
    if (!session) {
        redirect("/oidc/login");
    }

    return (
        <main className="">
            <h1>Ishiko</h1>
            <Link href="/issues">Go to issues</Link>
            <a href="/oidc/logout">Sign out</a>
        </main>
    );
}
