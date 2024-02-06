import { Link } from "@/components/ui/link";
import { authenticate } from "./auth";

export default async function Home() {
    await authenticate();

    return (
        <main className="">
            <h1>Ishiko</h1>
            <Link href="/issues">Go to issues</Link>
            <a href="/oidc/logout">Sign out</a>
        </main>
    );
}
