import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { TrainingAspect } from "@/types/training";
import type { RatingLevel } from "@/types/ratings";
import { trainingAspects } from "@/types/training";

export const useTrainingAspects = (projectName: string | null, assessmentDate: string | null) => {
  const [aspects, setAspects] = useState<TrainingAspect[]>(trainingAspects);

  useEffect(() => {
    const loadAspectRatings = async () => {
      if (!projectName || !assessmentDate) return;

      try {
        const { data: ratings, error } = await supabase
          .from('ratings')
          .select('practice_name, rating, findings')
          .eq('project_name', projectName)
          .eq('assessment_date', assessmentDate)
          .eq('pillar_title', 'People')
          .like('practice_name', 'Training:%');

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          const updatedAspects = aspects.map(aspect => {
            const matchingRating = ratings.find(r => r.practice_name === `Training:${aspect.name}`);
            return {
              ...aspect,
              rating: matchingRating?.rating as RatingLevel || null,
              findings: matchingRating?.findings || ""
            };
          });
          setAspects(updatedAspects);
        }
      } catch (error) {
        console.error("Error loading ratings:", error);
        toast.error("Failed to load aspect ratings");
      }
    };

    loadAspectRatings();
  }, [projectName, assessmentDate]);

  const handleAspectClick = (index: number) => {
    const ratings: RatingLevel[] = [
      "Largely in Place",
      "Somewhat in Place",
      "Not in Place"
    ];
    
    const currentRating = aspects[index].rating;
    const currentIndex = currentRating ? ratings.indexOf(currentRating) : -1;
    const nextIndex = (currentIndex + 1) % ratings.length;
    
    const updatedAspects = [...aspects];
    updatedAspects[index] = {
      ...aspects[index],
      rating: ratings[nextIndex]
    };
    
    setAspects(updatedAspects);
  };

  const handleFindingsChange = (index: number, findings: string) => {
    const updatedAspects = [...aspects];
    updatedAspects[index] = {
      ...aspects[index],
      findings
    };
    setAspects(updatedAspects);
  };

  return {
    aspects,
    handleAspectClick,
    handleFindingsChange,
    setAspects
  };
};