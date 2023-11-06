import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export function IssueDetailSkeleton() {
  return (
    <DialogContent className="grid grid-cols-[1fr_1fr] auto-rows-auto gap-6 p-8 sm:w-3/4 lg:p-10 lg:gap-10 lg:w-1/2">
      <DialogHeader className="col-span-full pr-6">
        <DialogTitle className="text-left">
          <Skeleton className="h-[1em] w-60" />
        </DialogTitle>
      </DialogHeader>
      <div className="col-span-full flex flex-col lg:flex-row-reverse lg:justify-end lg:items-start gap-6 lg:gap-16">
        <div className="grid grid-cols-[max-content_1fr] auto-rows-auto items-baseline gap-1 gap-x-4 md:w-72">
          <Skeleton className="col-span-full h-[1em] w-32" />
          <Skeleton className="col-span-full h-[1em] w-32" />
          <Skeleton className="col-span-full h-[1em] w-32" />
          <Skeleton className="col-span-full h-[1em] w-32" />
        </div>
        <div className="w-80 sm:w-96">
          <div className="text-gray-500 text-sm font-medium mb-1">
            <Skeleton className="h-[1em] w-60" />
          </div>
          <Skeleton className="h-32 w-60" />
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
