import { useState } from "react";
import { RatingCircle } from "./RatingCircle";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface PillarCardProps {
  title: string;
  description: string;
  color: string;
  className?: string;
}

export const PillarCard = ({
  title,
  description,
  color,
  className,
}: PillarCardProps) => {
  const [rating, setRating] = useState(0);

  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-xl",
        className
      )}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <RatingCircle value={rating} color={color} size={80} />
        </div>
        <Slider
          value={[rating]}
          onValueChange={(value) => setRating(value[0])}
          max={10}
          step={1}
          className="mt-4"
        />
      </div>
    </div>
  );
};