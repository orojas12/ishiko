import { sessionManager } from "@/lib";
import { redirect } from "next/navigation";

export default async function IssuesLayout({
    children,
}: {
    children: React.ReactNode;
    issueDetail: React.ReactNode;
}) {
    const session = await sessionManager.validateSession();
    if (!session) {
        redirect("/login", "replace");
    }
    return (
        <main className="p-6 flex flex-col items-start gap-6">
            <h1 className="text-lg text-gray-600">Issues</h1>
            {children}
            {/* {issueDetail} */}
        </main>
    );
}
