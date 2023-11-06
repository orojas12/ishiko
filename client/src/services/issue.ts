import { GenericError, HttpError } from "@/lib/error";
import type {
  CreateOrUpdateIssue,
  HttpErrorResponseBody,
  Issue,
  IssueLabel,
  IssueStatus,
} from "@/types";

// TODO: figure out a better way to handle fetch errors

export async function getIssue(id: string): Promise<Issue> {
  try {
    const res = await fetch(`http://localhost:8080/issue/${id}`);
    const data = await res.json();
    if (res.ok) {
      return {
        ...data,
        dueDate: data?.dueDate ? new Date(data.dueDate) : undefined,
        createdDate: new Date(data.createdDate),
      };
    } else {
      throw new HttpError((data as HttpErrorResponseBody).message);
    }
  } catch (e) {
    if (e instanceof HttpError) {
      throw e;
    } else {
      throw new GenericError();
    }
  }
}

export async function getIssues(): Promise<Issue[]> {
  console.log("Fetching issues...");
  const res = await fetch("http://localhost:8080/issue", { cache: "no-store" });
  const data = await res.json();
  if (res.ok) {
    return data.map((issue: any) => ({
      ...issue,
      dueDate: issue.dueDate ? new Date(issue.dueDate) : undefined,
      createdDate: new Date(issue.createdDate),
    }));
  } else {
    throw new HttpError((data as HttpErrorResponseBody).message);
  }
}

export async function getIssueStatuses() {
  const res = await fetch(`http://localhost:8080/issue_status`);
  const data = (await res.json()) as IssueStatus[];
  if (res.ok) {
    return data;
  } else {
    // throw new HttpError((data as HttpErrorResponseBody).message);
  }
}

export async function getIssueLabels() {
  const res = await fetch(`http://localhost:8080/issue_label`);
  const data = (await res.json()) as IssueLabel[];
  if (res.ok) {
    return data;
  } else {
  }
}

export async function createIssue(issue: CreateOrUpdateIssue) {
  const res = await fetch("http://localhost:8080/issue", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...issue,
      dueDate: issue.dueDate?.toISOString(),
    }),
  });
  const data = (await res.json()) as Issue | HttpErrorResponseBody;
  if (res.ok) {
    return data;
  } else {
    throw new HttpError((data as HttpErrorResponseBody).message);
  }
}

export async function updateIssue({
  id,
  issue,
}: {
  id: number;
  issue: CreateOrUpdateIssue;
}) {
  const res = await fetch(`http://localhost:8080/issue/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...issue,
      dueDate: issue.dueDate?.toISOString(),
    }),
  });
  const data = (await res.json()) as Issue | HttpErrorResponseBody;
  if (res.ok) {
    return data;
  } else {
    throw new HttpError((data as HttpErrorResponseBody).message);
  }
}

export async function deleteIssue(id: number) {
  const res = await fetch(`http://localhost:8080/issue/${id}`, {
    method: "DELETE",
  });
  if (res.ok) {
    return;
  } else {
    throw new HttpError("Failed to delete issue: " + id);
  }
}
