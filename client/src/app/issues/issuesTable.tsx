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
import { useQuery } from "@tanstack/react-query";
import { Link } from "@/components/ui/link";

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
    cell: (props) => props.getValue().name,
  }),
  columnHelper.accessor("dueDate", {
    header: "Due date",
    cell: (props) => props.getValue()?.toISOString(),
  }),
  columnHelper.accessor("createdDate", {
    header: "Created",
    cell: (props) => props.getValue()?.toISOString(),
  }),
];

async function fetchIssues() {
  const res = await fetch("http://localhost:8080/issue");
  return res.json() as Promise<Issue[]>;
}

export function IssuesTable() {
  const issues = useQuery({ queryKey: ["issues"], queryFn: fetchIssues });

  const table = useReactTable({
    data: issues.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
  );
}
