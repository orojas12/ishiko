"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export default function IssuesLayout({
  children,
  issueDialog,
}: {
  children: React.ReactNode;
  issueDialog: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {issueDialog}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
