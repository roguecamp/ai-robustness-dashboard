import { AspectCard } from "@/components/business-alignment/AspectCard";
import type { RatingLevel } from "@/types/ratings";

interface BaseAspect {
  name: string;
  description: string;
  rating: RatingLevel | null;
  findings: string;
}

interface AspectGridProps<T extends BaseAspect> {
  aspects: T[];
  onAspectClick: (index: number) => void;
  onFindingsChange: (index: number, findings: string) => void;
}

export function AspectGrid<T extends BaseAspect>({ 
  aspects, 
  onAspectClick, 
  onFindingsChange 
}: AspectGridProps<T>) {
  return (
    <div className="grid gap-4">
      {aspects.map((aspect, index) => (
        <AspectCard
          key={aspect.name}
          aspect={aspect}
          onClick={() => onAspectClick(index)}
          onFindingsChange={(findings) => onFindingsChange(index, findings)}
        />
      ))}
    </div>
  );
}