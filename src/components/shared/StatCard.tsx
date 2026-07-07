import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { slideUp } from "@/lib/motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: string; positive: boolean };
  index?: number;
  accent?: "teal" | "blue" | "amber" | "rose";
}

const accentStyles = {
  teal: "bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400",
  blue: "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
};

export function StatCard({
  title,
  value,
  icon,
  trend,
  index = 0,
  accent = "teal",
}: StatCardProps) {
  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
    >
      <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              {trend && (
                <div className="flex items-center gap-1.5">
                  {trend.positive ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <Badge
                    variant={trend.positive ? "success" : "destructive"}
                    className="text-[10px] font-medium"
                  >
                    {trend.value}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    vs last month
                  </span>
                </div>
              )}
            </div>
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl",
                accentStyles[accent]
              )}
            >
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
