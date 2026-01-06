import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { BaseAspect } from "@/types/ratings";

interface AspectGridProps<T extends BaseAspect> {
  aspects: T[];
  onAspectClick: (index: number) => void;
  onFindingsChange: (index: number, findings: string) => void;
  onOwnersChange?: (index: number, owners: string) => void;
}

const getRatingColor = (rating: BaseAspect["rating"]) => {
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

export function AspectGrid<T extends BaseAspect>({ 
  aspects, 
  onAspectClick, 
  onFindingsChange,
  onOwnersChange 
}: AspectGridProps<T>) {
  return (
    <div className="grid gap-4">
      {aspects.map((aspect, index) => (
        <div key={aspect.name} className="flex gap-4">
          <Card
            className={`flex-1 p-4 cursor-pointer transition-colors duration-200 ${getRatingColor(aspect.rating)}`}
            onClick={() => onAspectClick(index)}
          >
            <h3 className="font-semibold">{aspect.name}</h3>
            <p className="text-sm mt-1">{aspect.description}</p>
          </Card>
          <div className="w-48">
            <Textarea
              placeholder="Enter owner(s)..."
              value={aspect.owners || ""}
              onChange={(e) => onOwnersChange?.(index, e.target.value)}
              className="h-full min-h-[100px] resize-none"
            />
          </div>
          <div className="w-96">
            <Textarea
              placeholder="Enter findings..."
              value={aspect.findings || ""}
              onChange={(e) => onFindingsChange(index, e.target.value)}
              className="h-full min-h-[100px] resize-none"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
