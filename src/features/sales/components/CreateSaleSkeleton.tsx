import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateSaleSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-40" />
      <div className="flex gap-6 items-start">
        <div className="w-2/5">
          <Card className="border-none shadow-sm">
            <CardContent className="p-5 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-full" />
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="w-3/5">
          <Card className="border-none shadow-sm">
            <CardContent className="p-5 space-y-4">
              <Skeleton className="h-6 w-24" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-9 w-9" />
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between mb-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-28" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
