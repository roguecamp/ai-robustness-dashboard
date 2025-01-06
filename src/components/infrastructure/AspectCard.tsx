import type { InfrastructureAspect } from "@/types/infrastructure";
import { cn } from "@/lib/utils";

interface AspectCardProps {
  aspect: InfrastructureAspect;
  onClick: () => void;
}

export const AspectCard = ({ aspect, onClick }: AspectCardProps) => {
  const getRatingColor = (rating: InfrastructureAspect["rating"]) => {
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

  return (
    <div
      className={cn(
        "p-3 rounded-lg cursor-pointer transition-colors duration-200",
        getRatingColor(aspect.rating)
      )}
      onClick={onClick}
    >
      <h4 className="font-medium">{aspect.name}</h4>
      <p className="text-sm mt-1">{aspect.description}</p>
    </div>
  );
};