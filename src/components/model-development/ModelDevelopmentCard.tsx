import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { ModelDevelopmentAspect } from "@/types/model-development";

interface ModelDevelopmentCardProps {
  aspect: ModelDevelopmentAspect;
  onClick: () => void;
  onFindingsChange: (findings: string) => void;
}

export const ModelDevelopmentCard = ({ aspect, onClick, onFindingsChange }: ModelDevelopmentCardProps) => {
  const getRatingColor = (rating: ModelDevelopmentAspect["rating"]) => {
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

  const handleFindingsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onFindingsChange(e.target.value);
  };

  return (
    <div className="flex gap-4">
      <Card
        className={`flex-1 p-4 cursor-pointer transition-colors duration-200 ${getRatingColor(aspect.rating)}`}
        onClick={onClick}
      >
        <h3 className="font-semibold">{aspect.name}</h3>
        <p className="text-sm mt-1">{aspect.description}</p>
      </Card>
      <div className="w-96">
        <Textarea
          placeholder="Enter findings..."
          value={aspect.findings || ""}
          onChange={handleFindingsChange}
          className="h-full min-h-[100px] resize-none"
        />
      </div>
    </div>
  );
};