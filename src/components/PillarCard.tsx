import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { KeyPractice, RatingLevel, Pillar } from "@/types/ratings";

interface PillarCardProps extends Pillar {
  className?: string;
  onUpdate: (ratings: Record<string, KeyPractice[]>) => void;
  projectName?: string;
  assessmentDate?: string;
  currentRatings: Record<string, KeyPractice[]>;
}

export const PillarCard = ({
  title,
  description,
  color,
  keyPractices,
  className,
  onUpdate,
  projectName,
  assessmentDate,
  currentRatings,
}: PillarCardProps) => {
  const navigate = useNavigate();
  const [practices, setPractices] = useState<KeyPractice[]>(keyPractices);

  useEffect(() => {
    console.log(`Updating practices for ${title}:`, keyPractices);
    setPractices(keyPractices);
  }, [keyPractices, title]);

  const handlePracticeClick = (practice: KeyPractice, index: number) => {
    if (title === "People") {
      if (practice.name === "Training and Upskilling") {
        navigate(`/training-aspects?project=${projectName}&date=${assessmentDate}`);
        return;
      } else if (practice.name === "Collaboration") {
        navigate(`/collaboration-aspects?project=${projectName}&date=${assessmentDate}`);
        return;
      }
    }

    const ratings: RatingLevel[] = [
      "Largely in Place",
      "Somewhat in Place",
      "Not in Place",
    ];
    const currentIndex = ratings.indexOf(practice.rating || "Not in Place");
    const nextIndex = (currentIndex + 1) % ratings.length;
    handleRatingChange(index, ratings[nextIndex]);
  };

  const handleRatingChange = (practiceIndex: number, value: RatingLevel) => {
    const updatedPractices = [...practices];
    updatedPractices[practiceIndex] = {
      ...practices[practiceIndex],
      rating: value,
    };
    setPractices(updatedPractices);
    
    // Update the complete ratings object
    const updatedRatings = {
      ...currentRatings,
      [title]: updatedPractices
    };
    onUpdate(updatedRatings);
    console.log(`Updated ${title} - ${practices[practiceIndex].name}: ${value}`);
  };

  const getRatingColor = (rating: RatingLevel | null) => {
    console.log(`Getting color for rating: ${rating}`);
    switch (rating) {
      case "Largely in Place":
        return "bg-green-700 text-white";
      case "Somewhat in Place":
        return "bg-green-300 text-gray-900";
      case "Not in Place":
        return "bg-white border border-gray-200 text-gray-900";
      default:
        return "bg-gray-100 border border-gray-200 text-gray-900";
    }
  };

  const isSecurityPillar = title === "Security";

  return (
    <div className={cn("rounded-2xl p-6 glass-card transition-all duration-300 hover:shadow-xl", className)}>
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
                onClick={() => handlePracticeClick(practice, index)}
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