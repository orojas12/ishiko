import { GenericError, HttpError } from "@/lib/error";
import type {
  CreateOrUpdateIssue,
  HttpErrorResponseBody,
  Issue,
  IssueStatus,
} from "@/types";

export async function getIssue(id: string) {
  try {
    const res = await fetch(`http://localhost:8080/issue/${id}`);
    const data = (await res.json()) as Issue | HttpErrorResponseBody;
    if (res.ok) {
      return data;
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

export async function getIssues() {
  const res = await fetch("http://localhost:8080/issue");
  const data = (await res.json()) as Issue[] | HttpErrorResponseBody;
  if (res.ok) {
    return data;
  } else {
    throw new HttpError((data as HttpErrorResponseBody).message);
  }
}

export async function getIssueStatuses() {
  const res = await fetch(`http://localhost:8080/issue_status`);
  const data = (await res.json()) as IssueStatus | HttpErrorResponseBody;
  if (res.ok) {
    return data;
  } else {
    throw new HttpError((data as HttpErrorResponseBody).message);
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

export async function updateIssue(id: number, issue: CreateOrUpdateIssue) {
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
