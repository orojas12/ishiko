"use client";

import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { Issue } from "../../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getIssues } from "@/services/issue";
import { CreateIssueDialog } from "./create-issue";
import { useState } from "react";
import { IssueDetail } from "./issue-detail";
import { Dialog } from "@/components/ui/dialog";

const columnHelper = createColumnHelper<Issue>();

export function IssuesTable() {
  const issues = useQuery({ queryKey: ["issues"], queryFn: getIssues });
  const [issueDetail, setIssueDetail] = useState<Issue | undefined>(undefined);
  const columns = [
    columnHelper.accessor("id", {
      header: "Id",
      cell: (props) => props.getValue(),
    }),
    columnHelper.accessor("subject", {
      header: "Subject",
      cell: (props) => (
        <Button
          variant="secondary-link"
          onClick={() =>
            setIssueDetail(
              issues.data?.find(
                (issue) => issue.id === props.row.getValue("id")
              )
            )
          }
        >
          {props.getValue()}
        </Button>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (props) => props.getValue().name,
    }),
    columnHelper.accessor("label", {
      header: "Label",
      cell: (props) => props.getValue()?.name,
    }),
    columnHelper.accessor("dueDate", {
      header: "Due date",
      cell: (props) => props.getValue()?.toLocaleString(),
    }),
    columnHelper.accessor("createdDate", {
      header: "Created",
      cell: (props) => props.getValue().toLocaleString(),
    }),
  ];
  const table = useReactTable({
    data: issues.data as Issue[],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Dialog
        open={issueDetail !== undefined}
        onOpenChange={() => setIssueDetail(undefined)}
      >
        <IssueDetail data={issueDetail} />
      </Dialog>
      <CreateIssueDialog />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
