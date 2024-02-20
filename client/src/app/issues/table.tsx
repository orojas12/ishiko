import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Issue } from "@/types";

export function IssuesTable(props: { issues: Issue[] }) {
    return (
        <>
            <div className="border border-border w-full rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Label</TableHead>
                            <TableHead>Due</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {props.issues.map((issue) => (
                            <TableRow key={issue.id}>
                                <TableCell>{issue.id}</TableCell>
                                <TableCell>{issue.subject}</TableCell>
                                <TableCell>{issue.status.name}</TableCell>
                                <TableCell>{issue.label.name}</TableCell>
                                <TableCell>{issue.dueDate || "-"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
