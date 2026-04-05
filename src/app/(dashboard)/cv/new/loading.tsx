import { Skeleton } from "@/components/ui/Skeleton";

export default function NewCVLoading() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Skeleton className="mb-2 h-8 w-56" />
      <Skeleton className="mb-8 h-4 w-80" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border-2 border-gray-200 p-5">
            <Skeleton className="mb-3 h-32 w-full" />
            <Skeleton className="mb-2 h-4 w-20" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="mt-1 h-3 w-3/4" />
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <Skeleton className="h-10 w-32" />
      </div>
    </main>
  );
}
