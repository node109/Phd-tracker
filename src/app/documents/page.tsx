import Link from "next/link";
import { getDocuments, getProgrammes } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DOCUMENT_STATUS_LABELS, DOCUMENT_STATUSES, DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS, type DocumentStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const [programmes, documents] = await Promise.all([getProgrammes(), getDocuments()]);

  const statusByKey = new Map(documents.map((d) => [`${d.programme_id}:${d.type}`, d.status]));

  const rows = programmes.flatMap((programme) =>
    DOCUMENT_TYPES.map((type) => ({
      programme,
      type,
      status: statusByKey.get(`${programme.id}:${type}`) ?? ("not_started" as DocumentStatus),
    }))
  );

  const rowsByStatus = DOCUMENT_STATUSES.map((status) => ({
    status,
    rows: rows.filter((r) => r.status === status),
  }));

  if (programmes.length === 0) {
    return <p className="text-sm text-muted-foreground">Add a programme to start tracking its documents.</p>;
  }

  return (
    <div className="space-y-6">
      {rowsByStatus.map(({ status, rows: statusRows }) => (
        <Card key={status}>
          <CardHeader>
            <CardTitle className="text-base text-foreground">
              {DOCUMENT_STATUS_LABELS[status]} ({statusRows.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statusRows.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing here.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>University</TableHead>
                    <TableHead>Programme</TableHead>
                    <TableHead>Document</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statusRows.map(({ programme, type }) => (
                    <TableRow key={`${programme.id}:${type}`}>
                      <TableCell>
                        <Link href={`/programmes/${programme.id}`} className="hover:underline">
                          {programme.university}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{programme.programme}</TableCell>
                      <TableCell>{DOCUMENT_TYPE_LABELS[type]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
