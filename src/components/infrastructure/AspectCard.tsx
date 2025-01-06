import { cn } from "@/lib/utils";
import type { InfrastructureAspect } from "@/types/infrastructure";

interface AspectCardProps {
  aspect: InfrastructureAspect;
  onClick: () => void;
}

export const AspectCard = ({ aspect, onClick }: AspectCardProps) => {
  const getRatingColor = (rating: InfrastructureAspect["rating"]) => {
    switch (rating) {
      case "Largely in Place":
        return "bg-green-700 text-white hover:bg-green-800";
      case "Somewhat in Place":
        return "bg-green-300 text-gray-900 hover:bg-green-400";
      case "Not in Place":
        return "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50";
      default:
        return "bg-gray-100 border border-gray-200 text-gray-900 hover:bg-gray-200";
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 rounded-lg cursor-pointer transition-colors duration-200",
        getRatingColor(aspect.rating)
      )}
    >
      <h3 className="font-medium mb-2">{aspect.name}</h3>
      <p className="text-sm opacity-90">{aspect.description}</p>
    </div>
  );
};