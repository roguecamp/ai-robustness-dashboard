import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useDashboardStore } from "./DashboardState";

export const SaveRatingsButton = () => {
  const { projectName, assessmentDate, pillarRatings } = useDashboardStore();

  const handleSaveAllRatings = async () => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    try {
      console.log('Saving ratings for:', projectName, assessmentDate);
      console.log('Ratings to save:', pillarRatings);

      const ratingsToUpsert = Object.entries(pillarRatings).flatMap(([pillarTitle, practices]) =>
        practices.map(practice => ({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: pillarTitle,
          practice_name: practice.name,
          rating: practice.rating
        }))
      );

      console.log('Preparing to upsert ratings:', ratingsToUpsert);

      const { error } = await supabase
        .from("ratings")
        .upsert(ratingsToUpsert, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name',
          ignoreDuplicates: false
        });

      if (error) throw error;
      
      console.log('Successfully saved ratings');
      toast.success("Successfully saved all ratings");
    } catch (error) {
      console.error("Error saving ratings:", error);
      toast.error("Failed to save ratings");
    }
  };

  return (
    <div className="flex justify-center pt-8">
      <Button 
        onClick={handleSaveAllRatings}
        className="px-8"
        size="lg"
      >
        Save All Ratings
      </Button>
    </div>
  );
};