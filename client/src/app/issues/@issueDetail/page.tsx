"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getIssue } from "@/services/issue";
import { Issue } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IssueDetail } from "./issue-detail";
import { IssueDetailSkeleton } from "./issue-detail-skeleton";

export default function IssueDetailDialog() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const issue = useQuery({
    queryKey: ["issue", id],
    enabled: id !== null,
    queryFn: () => getIssue(id!),
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (id === null) {
      setOpen(false);
    } else setOpen(true);
  }, [id]);

  const onOpenChange = () => {
    router.push("/issues");
  };

  const data = issue.data as Issue | undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {issue.isLoading ? (
        <IssueDetailSkeleton />
      ) : data ? (
        <IssueDetail data={data} />
      ) : (
        <DialogContent className="p-8 w-80 h-72">
          <div className="m-auto">{issue?.error?.message}</div>
        </DialogContent>
      )}
    </Dialog>
  );
}
