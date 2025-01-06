import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { calculateOverallRating } from "@/utils/businessAlignmentScoring";
import { BusinessAlignmentHeader } from "@/components/business-alignment/BusinessAlignmentHeader";
import { BusinessAlignmentGrid } from "@/components/business-alignment/BusinessAlignmentGrid";
import { useBusinessAlignmentAspects } from "@/hooks/useBusinessAlignmentAspects";

const BusinessAlignmentAspects = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get("project");
  const assessmentDate = searchParams.get("date");
  
  const { aspects, handleAspectClick } = useBusinessAlignmentAspects(projectName, assessmentDate);

  const handleSaveOverallRating = async () => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    const overallRating = calculateOverallRating(aspects);
    if (!overallRating) {
      toast.error("Please rate at least one aspect");
      return;
    }

    try {
      console.log("Saving business alignment ratings...");
      
      const { error } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Strategy",
          practice_name: "Business Alignment",
          rating: overallRating
        });

      if (error) throw error;

      // Also save individual aspect ratings
      for (const aspect of aspects) {
        if (aspect.rating) {
          const { error: aspectError } = await supabase
            .from("ratings")
            .upsert({
              project_name: projectName,
              assessment_date: assessmentDate,
              pillar_title: "Strategy",
              practice_name: aspect.name,
              rating: aspect.rating
            });

          if (aspectError) throw aspectError;
        }
      }

      console.log("Successfully saved all ratings");
      toast.success("Ratings saved successfully");
      navigate(`/?project=${projectName}&date=${assessmentDate}`);
    } catch (error) {
      console.error("Error saving ratings:", error);
      toast.error("Failed to save ratings");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <BusinessAlignmentHeader onBackClick={() => navigate('/')} />
        <BusinessAlignmentGrid 
          aspects={aspects}
          onAspectClick={handleAspectClick}
        />
        <div className="flex justify-end">
          <Button onClick={handleSaveOverallRating}>Save Overall Rating</Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessAlignmentAspects;