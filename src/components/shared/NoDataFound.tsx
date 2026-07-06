import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PackageOpen } from "lucide-react";
import { fadeIn, scaleIn } from "@/lib/motion";
import { Button } from "@/components/ui/button";

interface NoDataFoundProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  message?: string;
  ctaLabel?: string;
  ctaTo?: string;
  action?: ReactNode;
}

export function NoDataFound({
  icon,
  title,
  description,
  message,
  ctaLabel,
  ctaTo,
  action,
}: NoDataFoundProps) {
  const displayTitle = title ?? message ?? "No data found";
  const displayDesc = description ?? "";

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.25 }}
        className="mb-4 text-muted-foreground"
      >
        {icon ?? <PackageOpen className="h-12 w-12 mx-auto" />}
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.2 }}
        className="text-lg font-semibold"
      >
        {displayTitle}
      </motion.h3>
      {displayDesc && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.2 }}
          className="mt-1 max-w-sm text-sm text-muted-foreground"
        >
          {displayDesc}
        </motion.p>
      )}
      {ctaLabel && ctaTo && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.2 }}
          className="mt-6"
        >
          <Button asChild>
            <Link to={ctaTo}>{ctaLabel}</Link>
          </Button>
        </motion.div>
      )}
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.2 }}
          className="mt-6"
        >
          {action as ReactNode}
        </motion.div>
      )}
    </motion.div>
  );
}

export default NoDataFound;
