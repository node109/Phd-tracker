import { createTask } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TaskRow } from "@/components/task-row";
import { getTasks } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const tasks = await getTasks();
  const open = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Add a task or note</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createTask} className="flex gap-2">
            <Input name="title" placeholder="e.g. Read Sterman - Business Dynamics" required className="flex-1" />
            <Button type="submit">Add</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground">Open ({open.length})</h2>
        {open.length === 0 && <p className="text-sm text-muted-foreground">Nothing open — nice.</p>}
        {open.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </div>

      {done.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground">Done ({done.length})</h2>
          {done.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
