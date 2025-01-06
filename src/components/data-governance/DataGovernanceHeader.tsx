import { Button } from "@/components/ui/button";

interface DataGovernanceHeaderProps {
  onBackClick: () => void;
}

export const DataGovernanceHeader = ({ onBackClick }: DataGovernanceHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold mb-2">Data Governance Aspects</h1>
        <p className="text-gray-600">
          Rate each aspect of Data Governance by clicking on the cards. Click multiple times to cycle through ratings.
        </p>
      </div>
      <Button onClick={onBackClick}>Back to Dashboard</Button>
    </div>
  );
};