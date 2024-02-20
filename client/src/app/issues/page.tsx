import { IssuesTable } from "./table";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import {
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    Pagination as PaginationRoot,
} from "@/components/ui/pagination";
import { IssueFilters } from "./filters";
import { link, readFileSync } from "fs";
import path from "path";
import { authenticate } from "../auth";
import { logger } from "@/log";
import { Issue, Project } from "@/types";
import { maxHeaderSize } from "http";

const ISSUES_URL = `${process.env.API_URL}/api/resource/projects/project_1/issues`;

async function getIssues(
    accessToken: string,
    params: {
        status?: string[];
        label?: string[];
        page?: string;
    }
): Promise<Issue[]> {
    const url = new URL(ISSUES_URL);
    if (params.status) {
        url.searchParams.set("status", params.status.join());
    }
    if (params.label) {
        url.searchParams.set("label", params.label.join());
    }
    if (params.page) {
        url.searchParams.set("page", params.page);
    }
    const response = await fetch(url.toString(), {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
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
        status?: string | string[];
        label?: string | string[];
        page?: string;
    };
}) {
    const session = await authenticate();
    if (!session) {
        return null;
    }
    const accessToken = session.tokens.accessToken.value;
    const [issues, project] = await Promise.all([
        getIssues(accessToken, {
            status:
                typeof searchParams.status === "string"
                    ? [searchParams.status]
                    : searchParams.status,
            label:
                typeof searchParams.label === "string"
                    ? [searchParams.label]
                    : searchParams.label,
            page: searchParams.page,
        }),
        getProjectData(accessToken),
    ]);
    logger.debug(project);
    // const priorities = searchParams.priority?.split(",");
    if (labels) {
        const value = labels.join();
        urlParams.set("label", value);
    }
    if (priorities) {
        const value = priorities.join();
        urlParams.set("priority", value);
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
                    labels={project.labels}
                    statuses={project.statuses}
                />
                <IssuesTable issues={filteredIssues} />
            </div>
        </div>
    );
}
