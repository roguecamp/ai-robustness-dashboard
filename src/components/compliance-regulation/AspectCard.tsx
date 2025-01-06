import { ComplianceRegulationAspect } from "@/types/compliance-regulation";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AspectCardProps {
  aspect: ComplianceRegulationAspect;
  onClick: () => void;
}

export const AspectCard = ({ aspect, onClick }: AspectCardProps) => {
  const getRatingColor = (rating: string | null) => {
    switch (rating) {
      case "Largely in Place":
        return "bg-green-100 hover:bg-green-200";
      case "Somewhat in Place":
        return "bg-yellow-100 hover:bg-yellow-200";
      case "Not in Place":
        return "bg-red-100 hover:bg-red-200";
      default:
        return "bg-gray-100 hover:bg-gray-200";
    }
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-colors",
        getRatingColor(aspect.rating)
      )}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-lg">{aspect.name}</CardTitle>
        <CardDescription>{aspect.description}</CardDescription>
        <div className="mt-2 text-sm font-medium">
          Rating: {aspect.rating || "Not Rated"}
        </div>
      </CardHeader>
    </Card>
  );
};