import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useDashboardStore } from "./DashboardState";

export const SaveRatingsButton = () => {
  const { projectName, assessmentDate, pillarRatings } = useDashboardStore();

  const handleSaveAllRatings = async () => {
    try {
      const allPromises: Promise<any>[] = [];
      
      Object.entries(pillarRatings).forEach(([pillarTitle, practices]) => {
        practices.forEach(async (practice) => {
          const promise = supabase
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
            .select();
            
          allPromises.push(promise);
        });
      });
      
      await Promise.all(allPromises);
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