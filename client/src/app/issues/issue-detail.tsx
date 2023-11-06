import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  deleteIssue,
  getIssue,
  getIssueLabels,
  getIssueStatuses,
  updateIssue,
} from "@/services/issue";
import { Issue } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";

export function IssueDetail({
  issueId,
  onClose,
}: {
  issueId: number | undefined;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const issue = useQuery({
    queryKey: ["issue", issueId],
    queryFn: () =>
      issueId !== undefined ? getIssue(issueId.toString()) : undefined,
    enabled: issueId !== undefined,
  });
  const issueStatuses = useQuery({
    queryKey: ["issue_statuses"],
    queryFn: getIssueStatuses,
  });
  const issueLabels = useQuery({
    queryKey: ["issue_labels"],
    queryFn: getIssueLabels,
  });
  const updateMutation = useMutation({
    mutationFn: updateIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["issue", issueId] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });

  const { data } = issue;

  const onStatusChange = (value: string) => {
    if (data !== undefined) {
      updateMutation.mutate({
        id: data.id,
        issue: {
          subject: data.subject,
          description: data.description,
          dueDate: data.dueDate,
          status: Number(value),
          label: data.label.id,
        },
      });
    }
  };

  const onDelete = () => {
    if (data !== undefined) {
      deleteMutation.mutate(data.id);
      onClose();
    }
  };

  return (
    <DialogContent className="grid grid-cols-[1fr_1fr] grid-rows-[max-content_max-content_1fr] gap-6 p-8 lg:p-10 lg:gap-10 h-full md:h-3/4">
      <DialogHeader className="col-span-full pr-6 gap-6">
        <DialogTitle className="text-left">
          {data?.subject}
          <span className="text-sm text-gray-500">&nbsp;#{data?.id}</span>
        </DialogTitle>
        <div className="col-span-full flex justify-start gap-2">
          <Select
            value={data?.status.id.toString()}
            onValueChange={onStatusChange}
          >
            <SelectTrigger className="lg:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {issueStatuses.data?.map((status) => (
                <SelectItem key={status.id} value={status.id.toString()}>
                  {status.name || "No status"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Edit issue</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <AlertDialogTrigger>Delete issue</AlertDialogTrigger>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this issue?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this issue and cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive-600"
                  onClick={onDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogHeader>
      <div className="col-span-full flex flex-col lg:flex-row-reverse lg:justify-end lg:items-start gap-6 lg:gap-16">
        <IssueDetailProperties>
          <IssueDetailProperty label="Label">
            {data?.label?.name}
          </IssueDetailProperty>
          <IssueDetailProperty label="Due">
            {data?.dueDate?.toLocaleString()}
          </IssueDetailProperty>
          <IssueDetailProperty label="Created">
            {data?.createdDate.toLocaleString()}
          </IssueDetailProperty>
        </IssueDetailProperties>
        <div className="w-80 sm:w-96">
          <div className="text-gray-500 text-sm font-medium mb-1">
            Description
          </div>
          <div>{data?.description}</div>
        </div>
      </div>
      <DialogFooter className="col-span-full">
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}

export function IssueDetailProperties({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[max-content_1fr] items-baseline gap-1 gap-x-4 md:w-72">
      {children}
    </div>
  );
}

export function IssueDetailProperty({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="col-start-1 col-end-2 text-gray-500 text-sm font-medium">
        {label}
      </div>
      <div className="col-start-2 col-end-3">{children || "-"}</div>
    </>
  );
}
