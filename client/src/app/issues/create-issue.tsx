"use client";

import { Button } from "@/components/ui/button";
import { CreateOrUpdateIssue } from "@/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createIssue,
  getIssueLabels,
  getIssueStatuses,
} from "@/services/issue";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

/**
 * Must match data type of {@link CreateOrUpdateIssue}
 */
const formSchema = z.object({
  subject: z
    .string({
      required_error: "Subject is required",
    })
    .min(1, { message: "Must be between 1 and 255 characters long" })
    .max(255, { message: "Must be between 1 and 255 characters long" }),
  description: z
    .string()
    .max(1000, { message: "Must be a maximum of 1000 characters" })
    .optional(),
  dueDate: z.date().optional(),
  status: z.coerce.number(),
  label: z.coerce.number(),
});

export type CreateIssueFormSchema = z.infer<typeof formSchema>;

export function CreateIssueDialog() {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateIssueFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      description: "",
      dueDate: undefined,
      status: 1,
      label: 1,
    },
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createIssue,
    onSuccess: () => {
      form.reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const issueStatuses = useQuery({
    queryKey: ["issue_statuses"],
    queryFn: getIssueStatuses,
  });

  const issueLabels = useQuery({
    queryKey: ["issue_labels"],
    queryFn: getIssueLabels,
  });

  const onSubmit = (values: CreateIssueFormSchema) => {
    console.log(values);
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Issue</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md lg:max-w-md">
        <DialogHeader>
          <DialogTitle>New issue</DialogTitle>
          <DialogDescription>
            Create a new issue for your project here. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-8 pt-4"
          >
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-2 sm:gap-x-4 sm:gap-y-1">
                  <FormLabel className="sm:text-right col-span-full sm:col-span-1">
                    Status
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="col-span-full sm:col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {issueStatuses.data?.map((status) => (
                        <SelectItem
                          key={status.id}
                          value={status.id.toString()}
                        >
                          {status.name || "None"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-2 sm:gap-x-4 sm:gap-y-1">
                  <FormLabel className="sm:text-right col-span-full sm:col-span-1">
                    Label
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="col-span-full sm:col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {issueLabels.data?.map((label) => (
                        <SelectItem key={label.id} value={label.id.toString()}>
                          {label.name || "None"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 auto-rows-auto items-center gap-2 sm:gap-x-4 sm:gap-y-1">
                  <FormLabel className="sm:text-right col-span-full sm:col-span-1">
                    Subject
                  </FormLabel>
                  <FormControl className="col-span-full sm:col-span-3">
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="col-span-full sm:col-start-2 sm:col-span-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 auto-rows-auto items-center gap-2 sm:gap-x-4 sm:gap-y-1">
                  <FormLabel className="sm:text-right col-span-full sm:col-span-1 sm:self-baseline sm:mt-3">
                    Description
                  </FormLabel>
                  <FormControl className="col-span-full sm:col-span-3">
                    <Textarea className="h-40" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-full sm:col-start-2 sm:col-span-3" />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row-reverse sm:justify-start gap-3">
              <Button type="submit">Save</Button>
              <DialogClose asChild>
                <Button variant="outline" onClick={() => form.reset()}>
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
