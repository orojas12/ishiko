import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
    title: "Ishiko",
    description: "Issue tracking application",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-background text-foreground">
                <Providers>
                    <div className="container">{children}</div>
                </Providers>
            </body>
        </html>
    );
}
