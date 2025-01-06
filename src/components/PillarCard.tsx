import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RatingCircle } from "./RatingCircle";
import type { Pillar } from "@/types/ratings";

interface PillarCardProps {
  title: string;
  description: string;
  color: string;
  keyPractices: { name: string; rating: string | null }[];
  onUpdate: (ratings: Record<string, string | null>) => void;
  projectName: string | null;
  assessmentDate: string | null;
  currentRatings: Record<string, string | null>;
}

export const PillarCard = ({
  title,
  keyPractices,
  onUpdate,
  projectName,
  assessmentDate,
  currentRatings,
}: PillarCardProps) => {
  const navigate = useNavigate();

  const handlePracticeClick = (practiceName: string) => {
    const params = new URLSearchParams({
      project: projectName || "",
      date: assessmentDate || "",
    });

    switch (practiceName) {
      case "Infrastructure":
        navigate(`/infrastructure-aspects?${params}`);
        break;
      case "Intellectual Property":
        navigate(`/intellectual-property-aspects?${params}`);
        break;
      default:
        console.log("No route defined for practice:", practiceName);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {keyPractices.map((practice) => (
          <div
            key={practice.name}
            onClick={() => handlePracticeClick(practice.name)}
            className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <span className="text-sm font-medium">{practice.name}</span>
            <RatingCircle rating={currentRatings[practice.name]} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};