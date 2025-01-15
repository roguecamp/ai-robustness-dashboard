import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BusinessAlignmentGrid } from "@/components/business-alignment/BusinessAlignmentGrid";
import { BusinessAlignmentHeader } from "@/components/business-alignment/BusinessAlignmentHeader";
import { useBusinessAlignmentAspects } from "@/hooks/useBusinessAlignmentAspects";
import { calculateOverallRating } from "@/utils/businessAlignmentScoring";

export default function BusinessAlignmentAspects() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get("project");
  const assessmentDate = searchParams.get("date");
  
  const { aspects, handleAspectClick, handleFindingsChange } = useBusinessAlignmentAspects(projectName, assessmentDate);

  const handleSave = async () => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    try {
      console.log("Saving business alignment overall rating...");
      
      const overallRating = calculateOverallRating(aspects);
      
      const { error } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Strategy",
          practice_name: "Business Alignment",
          rating: overallRating
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (error) throw error;

      console.log("Successfully saved business alignment overall rating:", overallRating);
      toast.success("Business alignment aspects saved successfully");
      navigate('/');
    } catch (error) {
      console.error("Error saving ratings:", error);
      toast.error("Failed to save ratings");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <BusinessAlignmentHeader onBackClick={() => navigate('/')} />
        <BusinessAlignmentGrid 
          aspects={aspects}
          onAspectClick={handleAspectClick}
          onFindingsChange={handleFindingsChange}
        />
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Overall Rating</Button>
        </div>
      </div>
    </div>
  );
}