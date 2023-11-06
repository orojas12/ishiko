import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Issue } from "@/types";

export function IssueDetail({ data }: { data: Issue | undefined }) {
  return (
    <DialogContent className="grid grid-cols-[1fr_1fr] grid-rows-[max-content_max-content_1fr] gap-6 p-8 lg:p-10 lg:gap-10 h-full md:h-3/4">
      <DialogHeader className="col-span-full pr-6">
        <DialogTitle className="text-left">
          {data?.subject}
          <span className="text-sm text-gray-500">&nbsp;#{data?.id}</span>
        </DialogTitle>
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
