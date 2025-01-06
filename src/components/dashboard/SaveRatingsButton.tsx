import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useDashboardStore } from "./DashboardState";

export const SaveRatingsButton = () => {
  const { projectName, assessmentDate, pillarRatings } = useDashboardStore();

  const handleSaveAllRatings = async () => {
    try {
      const promises = Object.entries(pillarRatings).flatMap(([pillarTitle, practices]) =>
        practices.map(practice => 
          supabase
            .from("ratings")
            .upsert({
              project_name: projectName,
              assessment_date: assessmentDate,
              pillar_title: pillarTitle,
              practice_name: practice.name,
              rating: practice.rating
            }, {
              onConflict: 'project_name,assessment_date,pillar_title,practice_name'
            })
            .select()
            .then(result => {
              if (result.error) throw result.error;
              return result;
            })
        )
      );
      
      await Promise.all(promises);
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