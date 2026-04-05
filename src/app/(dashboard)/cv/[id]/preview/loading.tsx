import { Skeleton } from "@/components/ui/Skeleton";

export default function PreviewLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <header className="flex items-center justify-between border-b bg-white px-6 py-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-36" />
      </header>

      <main className="flex flex-1 justify-center px-4 py-10">
        <div className="w-full max-w-[794px] rounded-sm bg-white shadow-lg p-10">
          <Skeleton className="mb-1 h-8 w-64" />
          <Skeleton className="mb-6 h-4 w-80" />

          <Skeleton className="mb-1 h-3 w-20" />
          <Skeleton className="mb-5 h-px w-full" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="mb-6 h-4 w-5/6" />

          <Skeleton className="mb-1 h-3 w-24" />
          <Skeleton className="mb-5 h-px w-full" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between mb-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="mb-1 h-3 w-32" />
              <Skeleton className="mb-1 h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          ))}

          <Skeleton className="mb-1 h-3 w-20" />
          <Skeleton className="mb-5 h-px w-full" />
          <Skeleton className="mb-1 h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </main>
    </div>
  );
}
