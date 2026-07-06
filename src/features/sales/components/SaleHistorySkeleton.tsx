import { Skeleton } from "@/components/ui/skeleton";

export default function SaleHistorySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16 ml-auto" />
        </div>
      ))}
    </div>
  );
}
