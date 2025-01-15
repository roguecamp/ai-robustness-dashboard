import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BusinessAlignmentGrid } from "@/components/business-alignment/BusinessAlignmentGrid";
import { BusinessAlignmentHeader } from "@/components/business-alignment/BusinessAlignmentHeader";
import { useBusinessAlignmentAspects } from "@/hooks/useBusinessAlignmentState";

export default function BusinessAlignmentAspects() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get("project");
  const assessmentDate = searchParams.get("date");
  
  const { aspects, handleAspectClick, handleFindingsChange } = useBusinessAlignmentAspects(projectName, assessmentDate);

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <BusinessAlignmentHeader onBackClick={() => navigate('/')} />
        <BusinessAlignmentGrid 
          aspects={aspects}
          onAspectClick={handleAspectClick}
          onFindingsChange={handleFindingsChange}
        />
      </div>
    </div>
  );
}