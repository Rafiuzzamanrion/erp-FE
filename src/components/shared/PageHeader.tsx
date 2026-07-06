import type { ReactNode } from "react";

interface PageHeaderProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  children,
}: PageHeaderProps) {
  const heading = title ?? (typeof children === "string" ? children : undefined);

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children && typeof children !== "string" && (
        <div className="flex items-center gap-2">{children}</div>
      )}
    </div>
  );
}

export default PageHeader;
