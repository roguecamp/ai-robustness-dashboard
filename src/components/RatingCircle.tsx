import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { RatingLevel } from "@/types/ratings";

interface RatingCircleProps {
  value: RatingLevel | null;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}

export const RatingCircle = ({
  value,
  size = 120,
  strokeWidth = 8,
  color = "#000",
  className,
}: RatingCircleProps) => {
  const [offset, setOffset] = useState(100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Convert rating to numeric value
  const getRatingValue = (rating: RatingLevel | null) => {
    switch(rating) {
      case "Largely in Place":
        return 10;
      case "Somewhat in Place":
        return 5;
      case "Not in Place":
        return 2;
      default:
        return 0;
    }
  };

  const progress = (getRatingValue(value) / 10) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(100 - progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className={cn("relative", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="rating-circle"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={(circumference * offset) / 100}
          strokeLinecap="round"
          stroke={color}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-semibold">{getRatingValue(value)}</span>
      </div>
    </div>
  );
};