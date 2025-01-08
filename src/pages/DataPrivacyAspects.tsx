import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AspectGrid } from "@/components/shared/AspectGrid";
import { useDataPrivacyAspects } from "@/hooks/useDataPrivacyAspects";
import { calculateOverallRating } from "@/utils/dataPrivacyScoring";
import { RatingKey } from "@/components/shared/RatingKey";

const DataPrivacyAspects = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get("project");
  const assessmentDate = searchParams.get("date");
  
  const { aspects, handleAspectClick, handleFindingsChange } = useDataPrivacyAspects(projectName, assessmentDate);

  const handleSave = async () => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    try {
      // Save individual aspect ratings
      for (const aspect of aspects) {
        const { error: aspectError } = await supabase
          .from("ratings")
          .upsert({
            project_name: projectName,
            assessment_date: assessmentDate,
            pillar_title: "Data",
            practice_name: `DataPrivacy:${aspect.name}`,
            rating: aspect.rating,
            findings: aspect.findings
          }, {
            onConflict: 'project_name,assessment_date,pillar_title,practice_name'
          });

        if (aspectError) throw aspectError;
      }

      // Calculate and save the overall rating
      const overallRating = calculateOverallRating(aspects);
      
      const { error } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Data",
          practice_name: "Data Privacy",
          rating: overallRating
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (error) throw error;

      toast.success("Data privacy aspects saved successfully");
      navigate('/');
    } catch (error) {
      console.error("Error saving ratings:", error);
      toast.error("Failed to save ratings");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Data Privacy Aspects</h1>
            <p className="text-gray-600">
              Rate each aspect of Data Privacy by clicking on the cards. Click multiple times to cycle through ratings.
            </p>
          </div>
          <div className="flex gap-4 items-start">
            <RatingKey />
            <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
          </div>
        </div>

        <AspectGrid
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
};

export default DataPrivacyAspects;