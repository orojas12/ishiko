import { IssuesTable } from "./table";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { IssueFilters } from "./filters";
import { readFileSync } from "fs";
import path from "path";

function getIssues() {
    const data = readFileSync(path.resolve("./src/MOCK_DATA.json"));
    const issues = JSON.parse(data.toString());
    return issues;
}

export default function TablePage({
    searchParams,
}: {
    searchParams: {
        label?: string;
        priority?: string;
        page?: string;
    };
}) {
    const labels = searchParams.label?.split(",");
    const priorities = searchParams.priority?.split(",");
    const issues = getIssues();
    const params = new URLSearchParams();
    if (labels) {
        const value = labels.join();
        params.set("label", value);
    }
    if (priorities) {
        const value = priorities.join();
        params.set("priority", value);
    }
    const page = parseInt(searchParams.page || "1");
    const filteredIssues = issues.filter((issue: any) => {
        if (labels) {
            return labels.includes(issue.label);
        } else {
            return true;
        }
    });

    return (
        <div className="flex justify-center items-center py-8">
            <div className="w-full max-w-screen-sm flex flex-col items-start gap-4">
                <IssueFilters />
                <IssuesTable issues={filteredIssues} />
                <div className="flex gap-2">
                    {page > 1 ? (
                        <Button variant="outline" asChild>
                            <Link
                                href={`?${params.toString()}&page=${page - 1}`}
                            >
                                Previous Page
                            </Link>
                        </Button>
                    ) : null}
                    <Button variant="outline" asChild>
                        <Link href={`?${params.toString()}&page=${page + 1}`}>
                            Next Page
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
