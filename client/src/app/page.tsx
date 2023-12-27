import { Link } from "@/components/ui/link";

export default function Home() {
    return (
        <main className="">
            <h1>Ishiko</h1>
            <Link href="/issues">Go to issues</Link>
            <a href="/oidc/logout">Sign out</a>
        </main>
    );
}
