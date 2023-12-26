import { sessionManager } from "@/lib";
import { config } from "@/config";

export default async function Authenticated({
    children,
}: {
    children: React.ReactNode;
}) {
    if (config.auth.disabled) {
        return <>{children}</>;
    }

    const session = await sessionManager.validateSession();
    if (!session) {
        return <Unauthenticated />;
    } else {
        return <>{children}</>;
    }
}

function Unauthenticated() {
    return (
        <div>
            <h1>You are not logged in</h1>
            <h3>
                Please <a href="/oidc/login">log in</a> to continue
            </h3>
        </div>
    );
}
