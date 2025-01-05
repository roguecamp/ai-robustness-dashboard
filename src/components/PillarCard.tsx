import { useState } from "react";
import { cn } from "@/lib/utils";
import type { KeyPractice, RatingLevel, Pillar } from "@/types/ratings";

interface PillarCardProps extends Pillar {
  className?: string;
  onUpdate?: (pillarTitle: string, practices: KeyPractice[]) => void;
}

export const PillarCard = ({
  title,
  description,
  color,
  keyPractices,
  className,
  onUpdate,
}: PillarCardProps) => {
  const [practices, setPractices] = useState<KeyPractice[]>(keyPractices);

  const handleRatingChange = (practiceIndex: number, value: RatingLevel) => {
    const updatedPractices = [...practices];
    updatedPractices[practiceIndex] = {
      ...practices[practiceIndex],
      rating: value,
    };
    setPractices(updatedPractices);
    if (onUpdate) {
      onUpdate(title, updatedPractices);
    }
    console.log(`Updated ${title} - ${practices[practiceIndex].name}: ${value}`);
  };

  const getRatingColor = (rating: RatingLevel | null) => {
    switch (rating) {
      case "Largely in Place":
        return "bg-green-700 text-white";
      case "Somewhat in Place":
        return "bg-green-300";
      case "Not in Place":
        return "bg-white border border-gray-200";
      default:
        return "bg-gray-100 border border-gray-200";
    }
  };

  const isSecurityPillar = title === "Security";

  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-xl",
        className
      )}
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold" style={{ color }}>
            {title}
          </h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        
        <div className={cn(
          "space-y-4",
          isSecurityPillar && "grid grid-cols-5 gap-4 space-y-0"
        )}>
          {practices.map((practice, index) => (
            <div key={practice.name} className="space-y-2">
              <div
                className={cn(
                  "p-3 rounded-lg cursor-pointer transition-colors duration-200",
                  getRatingColor(practice.rating)
                )}
                onClick={() => {
                  const ratings: RatingLevel[] = [
                    "Largely in Place",
                    "Somewhat in Place",
                    "Not in Place",
                  ];
                  const currentIndex = ratings.indexOf(practice.rating || "Not in Place");
                  const nextIndex = (currentIndex + 1) % ratings.length;
                  handleRatingChange(index, ratings[nextIndex]);
                }}
              >
                <h4 className="font-medium text-sm">{practice.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};