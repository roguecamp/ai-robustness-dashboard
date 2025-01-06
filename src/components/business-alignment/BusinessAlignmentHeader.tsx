import { Button } from "@/components/ui/button";
import { RatingKey } from "@/components/shared/RatingKey";

interface BusinessAlignmentHeaderProps {
  onBackClick: () => void;
}

export const BusinessAlignmentHeader = ({ onBackClick }: BusinessAlignmentHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold mb-2">Business Alignment Aspects</h1>
        <p className="text-gray-600">
          Rate each aspect of Business Alignment by clicking on the cards. Click multiple times to cycle through ratings.
        </p>
      </div>
      <div className="flex gap-4 items-start">
        <RatingKey />
        <Button onClick={onBackClick}>Back to Dashboard</Button>
      </div>
    </div>
  );
};