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
import { Calendar } from "@/components/ui/calendar";
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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteIssue,
  getIssue,
  getIssueLabels,
  getIssueStatuses,
  updateIssue,
} from "@/services/issue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, MoreHorizontal, Pencil, PencilLine, X } from "lucide-react";
import { Ref, useRef, useState } from "react";

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
  const [editableSubject, setEditableSubject] = useState(false);
  const [editableDesc, setEditableDesc] = useState(false);
  const subjectInputRef = useRef<HTMLInputElement>(null);
  const descTextareaRef = useRef<HTMLTextAreaElement>(null);

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

  const onLabelChange = (value: string) => {
    if (data !== undefined) {
      updateMutation.mutate({
        id: data.id,
        issue: {
          subject: data.subject,
          description: data.description,
          dueDate: data.dueDate,
          status: data.status.id,
          label: Number(value),
        },
      });
    }
  };

  const onDueDateChange = (date: Date | undefined) => {
    if (data !== undefined) {
      updateMutation.mutate({
        id: data.id,
        issue: {
          subject: data.subject,
          description: data.description,
          dueDate: date,
          status: data.status.id,
          label: data.label.id,
        },
      });
    }
  };

  const onSubjectChange = () => {
    if (data !== undefined) {
      updateMutation.mutate({
        id: data.id,
        issue: {
          subject: subjectInputRef.current?.value || data.subject,
          description: data.description,
          dueDate: data.dueDate,
          status: data.status.id,
          label: data.label.id,
        },
      });
      setEditableSubject(false);
    }
  };

  const onDescriptionChange = () => {
    if (data !== undefined) {
      updateMutation.mutate({
        id: data.id,
        issue: {
          subject: data.subject,
          description: descTextareaRef.current?.value || data.description,
          dueDate: data.dueDate,
          status: data.status.id,
          label: data.label.id,
        },
      });
      setEditableDesc(false);
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
        <div className="flex items-center gap-3">
          <DialogTitle className="text-left w-full">
            <IssueSubject
              id={data?.id.toString() || ""}
              subject={data?.subject || ""}
              editable={editableSubject}
              inputRef={subjectInputRef}
            />
          </DialogTitle>
          <div className="shrink-0">
            {editableSubject ? (
              <>
                <Button
                  onClick={onSubjectChange}
                  variant="secondary"
                  className="h-auto p-1 border border-transparent mr-1.5"
                >
                  <Check className="h-5 w-5" />
                </Button>
                <Button
                  onClick={() => setEditableSubject(false)}
                  variant="outline"
                  className="h-auto p-1 text-gray-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setEditableSubject(true)}
                variant="outline"
                className="h-auto p-1 text-gray-700"
              >
                <PencilLine className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
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
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 text-gray-700"
                >
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
            <Select
              value={data?.label.id.toString()}
              onValueChange={onLabelChange}
            >
              <SelectTrigger className="lg:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {issueLabels.data?.map((label) => (
                  <SelectItem key={label.id} value={label.id.toString()}>
                    {label.name || "-"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </IssueDetailProperty>
          <IssueDetailProperty label="Due">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-32 justify-start"
                >
                  {data?.dueDate?.toLocaleDateString() || "-"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={data?.dueDate}
                  onSelect={onDueDateChange}
                />
              </PopoverContent>
            </Popover>
          </IssueDetailProperty>
          <IssueDetailProperty label="Created">
            <span className="text-sm font-medium px-3">
              {data?.createdDate.toLocaleDateString()}
            </span>
          </IssueDetailProperty>
        </IssueDetailProperties>
        <div className="w-80 sm:w-96">
          <IssueDescription
            description={data?.description || ""}
            editable={editableDesc}
            textareaRef={descTextareaRef}
          />
          <div className="shrink-0">
            {editableDesc ? (
              <>
                <Button
                  onClick={onDescriptionChange}
                  variant="secondary"
                  className="h-auto p-1 border border-transparent mr-1.5"
                >
                  <Check className="h-5 w-5" />
                </Button>
                <Button
                  onClick={() => setEditableDesc(false)}
                  variant="outline"
                  className="h-auto p-1 text-gray-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setEditableDesc(true)}
                variant="outline"
                className="h-auto p-1 text-gray-700"
              >
                <PencilLine className="h-5 w-5" />
              </Button>
            )}
          </div>
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
    <div className="grid grid-cols-[max-content_1fr] auto-rows-fr items-center gap-1 gap-x-4 w-max">
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

function IssueSubject({
  id,
  subject,
  editable,
  inputRef,
}: {
  id: string;
  subject: string;
  editable: boolean;
  inputRef: Ref<HTMLInputElement>;
}) {
  return editable ? (
    <Input ref={inputRef} defaultValue={subject} autoFocus />
  ) : (
    <>
      {subject}
      <span className="text-sm text-gray-500">&nbsp;#{id}</span>
    </>
  );
}

function IssueDescription({
  description,
  editable,
  textareaRef,
}: {
  description: string;
  editable: boolean;
  textareaRef: Ref<HTMLTextAreaElement>;
}) {
  return editable ? (
    <Textarea
      ref={textareaRef}
      defaultValue={description}
      autoFocus
      className="mb-2"
    />
  ) : (
    <>
      <div className="text-gray-500 text-sm font-medium mb-1">Description</div>
      <div className="mb-1">{description}</div>
    </>
  );
}
