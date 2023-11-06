export default function IssuesLayout({
  children,
  issueDetail,
}: {
  children: React.ReactNode;
  issueDetail: React.ReactNode;
}) {
  return (
    <main className="p-6 flex flex-col items-start gap-6">
      <h1 className="text-lg text-gray-600">Issues</h1>
      {children}
      {/* {issueDetail} */}
    </main>
  );
}
