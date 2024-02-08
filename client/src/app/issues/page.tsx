import { IssuesTable } from "./table";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { IssueFilters } from "./filters";
import { readFileSync } from "fs";
import path from "path";
import { authenticate } from "../auth";
import { logger } from "@/log";
import { Issue, Project } from "@/types";

async function getIssues(accessToken: string): Promise<Issue[]> {
    const response = await fetch(
        `${process.env.API_URL}/api/resource/projects/project_1/issues`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
    return response.json();
}

async function getProjectData(accessToken: string): Promise<Project> {
    const response = await fetch(
        `${process.env.API_URL}/api/resource/projects/project_1`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
    return response.json();
}

export default async function TablePage({
    searchParams,
}: {
    searchParams: {
        label?: string;
        priority?: string;
        page?: string;
    };
}) {
    const session = await authenticate();
    if (!session) {
        return null;
    }
    const accessToken = session.tokens.accessToken.value;
    const [issues, project] = await Promise.all([
        getIssues(accessToken),
        getProjectData(accessToken),
    ]);
    // TODO: server returning undefined labels
    console.log("labels: " + project.issueLabels.toString());
    const labels = searchParams.label?.split(",");
    const priorities = searchParams.priority?.split(",");
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
    const filteredIssues = issues.filter((issue: Issue) => {
        if (labels) {
            return labels.includes(issue.label.id.toString());
        } else {
            return true;
        }
    });

    return (
        <div className="flex justify-center items-center py-8">
            <div className="w-full max-w-screen-sm flex flex-col items-start gap-4">
                <IssueFilters
                    labels={project.issueLabels}
                    statuses={project.issueStatuses}
                />
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
