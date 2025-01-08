import { Button } from "@/components/ui/button";

interface TrainingHeaderProps {
  onBackClick: () => void;
}

export const TrainingHeader = ({ onBackClick }: TrainingHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">Training and Upskilling Aspects</h1>
        <p className="text-gray-500">Evaluate each aspect to determine overall rating</p>
      </div>
      <Button onClick={onBackClick}>Back to Dashboard</Button>
    </div>
  );
};