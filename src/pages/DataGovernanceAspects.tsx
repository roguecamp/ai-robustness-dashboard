import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { calculateOverallRating } from "@/utils/dataGovernanceScoring";
import { DataGovernanceHeader } from "@/components/data-governance/DataGovernanceHeader";
import { DataGovernanceGrid } from "@/components/data-governance/DataGovernanceGrid";
import { useDataGovernanceAspects } from "@/hooks/useDataGovernanceAspects";

export default function DataGovernanceAspects() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get("project");
  const assessmentDate = searchParams.get("date");
  
  const { aspects, isLoading, handleAspectClick } = useDataGovernanceAspects(projectName, assessmentDate);

  const handleSave = async () => {
    if (!projectName || !assessmentDate) {
      toast.error("Missing project information");
      return;
    }

    try {
      console.log("Saving data governance ratings...");
      
      // Save individual aspect ratings
      for (const aspect of aspects) {
        const { error: aspectError } = await supabase
          .from("ratings")
          .upsert({
            project_name: projectName,
            assessment_date: assessmentDate,
            pillar_title: "Data",
            practice_name: `DataGovernance:${aspect.name}`,
            rating: aspect.rating
          }, {
            onConflict: "project_name,assessment_date,pillar_title,practice_name"
          });

        if (aspectError) {
          console.error(`Error saving aspect ${aspect.name}:`, aspectError);
          throw aspectError;
        }
      }

      // Calculate and save the overall rating
      const overallRating = calculateOverallRating(aspects);
      console.log("Saving overall rating:", overallRating);
      
      const { error } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Data",
          practice_name: "Data Governance",
          rating: overallRating
        }, {
          onConflict: "project_name,assessment_date,pillar_title,practice_name"
        });

      if (error) {
        console.error("Error saving overall rating:", error);
        throw error;
      }
      
      toast.success("Data governance aspects saved successfully");
      navigate("/");
    } catch (error) {
      console.error("Error saving ratings:", error);
      toast.error("Failed to save ratings");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading data governance aspects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto space-y-8">
        <DataGovernanceHeader onBackClick={() => navigate("/")} />
        <DataGovernanceGrid aspects={aspects} onAspectClick={handleAspectClick} />
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Overall Rating</Button>
        </div>
      </div>
    </div>
  );
}