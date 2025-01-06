import { Card } from "@/components/ui/card";
import type { ComplianceRegulationAspect } from "@/types/compliance-regulation";

interface AspectCardProps {
  aspect: ComplianceRegulationAspect;
  onClick: () => void;
}

export const AspectCard = ({ aspect, onClick }: AspectCardProps) => {
  const getRatingColor = (rating: ComplianceRegulationAspect["rating"]) => {
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

  return (
    <Card
      className={`p-4 cursor-pointer transition-colors duration-200 ${getRatingColor(aspect.rating)}`}
      onClick={onClick}
    >
      <h3 className="font-semibold">{aspect.name}</h3>
      <p className="text-sm mt-1">{aspect.description}</p>
    </Card>
  );
};