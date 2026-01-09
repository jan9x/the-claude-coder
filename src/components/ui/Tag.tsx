import { cn } from "@/lib/utils/cn";
import Link from "next/link";

interface TagProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
}

export function Tag({ children, href, className }: TagProps) {
  const baseClasses = cn(
    "inline-flex items-center px-3 py-1 text-sm font-medium rounded-full",
    "bg-primary-50 text-primary-600",
    "transition-colors duration-150",
    href && "hover:bg-primary-100",
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return <span className={baseClasses}>{children}</span>;
}
