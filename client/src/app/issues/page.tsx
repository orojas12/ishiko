import { IssuesTable } from "./issues-table";
import { Link } from "@/components/ui/link";
import { getIssues } from "@/services/issue";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

export default async function Issues() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["issues"],
    queryFn: getIssues,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Link href="/">Home</Link>
      <IssuesTable />
    </HydrationBoundary>
  );
}
