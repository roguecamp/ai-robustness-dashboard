import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { KeyPractice, RatingLevel, Pillar } from "@/types/ratings";

interface PillarCardProps extends Pillar {
  className?: string;
}

export const PillarCard = ({
  title,
  description,
  color,
  keyPractices,
  className,
}: PillarCardProps) => {
  const [practices, setPractices] = useState<KeyPractice[]>(keyPractices);

  const handleRatingChange = (practiceIndex: number, value: RatingLevel) => {
    const updatedPractices = [...practices];
    updatedPractices[practiceIndex] = {
      ...practices[practiceIndex],
      rating: value,
    };
    setPractices(updatedPractices);
    console.log(`Updated ${title} - ${practices[practiceIndex].name}: ${value}`);
  };

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
        
        <div className="space-y-6">
          {practices.map((practice, index) => (
            <div key={practice.name} className="space-y-3">
              <h4 className="font-medium text-sm">{practice.name}</h4>
              <RadioGroup
                value={practice.rating || ""}
                onValueChange={(value) => 
                  handleRatingChange(index, value as RatingLevel)
                }
                className="flex flex-col space-y-1"
              >
                {["Largely in Place", "Somewhat in Place", "Not in Place"].map(
                  (level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <RadioGroupItem value={level} id={`${practice.name}-${level}`} />
                      <Label htmlFor={`${practice.name}-${level}`}>{level}</Label>
                    </div>
                  )
                )}
              </RadioGroup>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};