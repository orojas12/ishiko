export type Project = {
    id: string;
    name: string;
    description: string;
    issueStatuses: IssueStatus[];
    issueLabels: IssueLabel[];
};

export type Issue = {
    id: number;
    subject: string;
    description?: string;
    createdDate: string;
    dueDate?: string;
    status: IssueStatus;
    label: IssueLabel;
};

export type IssueStatus = {
    id: number;
    name: string;
};

export type IssueLabel = {
    id: number;
    name: string;
};

export type CreateOrUpdateIssue = {
    subject: string;
    description?: string;
    dueDate?: Date;
    status: IssueStatus["id"];
    label: IssueLabel["id"];
};

export type HttpErrorResponseBody = {
    message: string;
};
