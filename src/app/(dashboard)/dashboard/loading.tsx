import { Skeleton } from "@/components/ui/Skeleton";

function CVCardSkeleton() {
  return (
    <li className="flex items-center justify-between rounded-xl border bg-white px-5 py-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-14" />
        <Skeleton className="h-8 w-16" />
      </div>
    </li>
  );
}

export default function DashboardLoading() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
      <ul className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <CVCardSkeleton key={i} />
        ))}
      </ul>
    </main>
  );
}
