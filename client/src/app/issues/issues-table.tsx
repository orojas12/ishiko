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

const columnHelper = createColumnHelper<Issue>();

const columns = [
  columnHelper.accessor("id", {
    header: "Id",
    cell: (props) => props.getValue(),
  }),
  columnHelper.accessor("subject", {
    header: "Subject",
    cell: (props) => (
      <Link href={`/issues?id=${props.row.getValue("id")}`}>
        {props.getValue()}
      </Link>
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
    cell: (props) => props.getValue(),
  }),
  columnHelper.accessor("createdDate", {
    header: "Created",
    cell: (props) => props.getValue(),
  }),
];

export function IssuesTable() {
  const issues = useQuery({ queryKey: ["issues"], queryFn: getIssues });
  const table = useReactTable({
    data: issues.data as Issue[],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
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
