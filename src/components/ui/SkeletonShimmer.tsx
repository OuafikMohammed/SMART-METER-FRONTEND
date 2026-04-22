"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonShimmerProps {
  className?: string;
}

const SkeletonShimmer = ({ className }: SkeletonShimmerProps) => {
  return (
    <div className={cn(
      "relative overflow-hidden bg-white/5 rounded-lg",
      className
    )}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default SkeletonShimmer;
