import { Skeleton } from "@/components/ui/Skeleton";

export default function EditLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-36" />
      </header>

      <div className="flex flex-1 gap-0">
        <main className="flex-1 p-8">
          <div className="flex gap-2 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-7 flex-1 rounded-full" />
            ))}
          </div>
          <Skeleton className="mb-6 h-6 w-32" />
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </main>

        <aside className="w-80 shrink-0 border-l p-6">
          <div className="rounded-xl border bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-7 w-24" />
            </div>
            <div className="flex flex-col gap-3 mt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
