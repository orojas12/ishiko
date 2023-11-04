import { CreateIssueDialog } from "./createIssueDialog";
import { IssuesTable } from "./issuesTable";

export default function Issues() {
  return (
    <main className="p-6 flex flex-col items-start gap-6">
      <h1 className="text-lg text-gray-600">Issues</h1>
      <CreateIssueDialog />
      <IssuesTable />
    </main>
  );
}
