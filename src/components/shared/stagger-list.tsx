"use client";

import { cn } from "@/lib/utils";

interface StaggerListProps {
  children: React.ReactNode;
  className?: string;
  staggerMs?: number;
}

export function StaggerList({ children, className, staggerMs = 50 }: StaggerListProps) {
  return (
    <div className={cn("contents", className)}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div
              key={i}
              style={{
                animation: `fadeInUp 300ms cubic-bezier(0.16, 1, 0.3, 1) ${i * staggerMs}ms both`,
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}
