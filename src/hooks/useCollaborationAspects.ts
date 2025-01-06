import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { CollaborationAspect } from "@/types/collaboration";
import type { RatingLevel } from "@/types/ratings";

const initialAspects: CollaborationAspect[] = [
  {
    name: "Team Communication",
    description: "Effective communication channels and practices within AI teams.",
    rating: null
  },
  {
    name: "Cross-functional Collaboration",
    description: "Collaboration between AI teams and other departments.",
    rating: null
  },
  {
    name: "Knowledge Sharing",
    description: "Systems for sharing AI knowledge and best practices.",
    rating: null
  },
  {
    name: "Stakeholder Engagement",
    description: "Regular engagement with key stakeholders.",
    rating: null
  },
  {
    name: "External Partnerships",
    description: "Collaboration with external AI partners and vendors.",
    rating: null
  }
];

export const useCollaborationAspects = (projectName: string | null, assessmentDate: string | null) => {
  const [aspects, setAspects] = useState<CollaborationAspect[]>(initialAspects);

  useEffect(() => {
    const loadRatings = async () => {
      if (!projectName || !assessmentDate) return;

      try {
        console.log("Loading collaboration ratings for:", projectName, assessmentDate);
        const { data: ratings, error } = await supabase
          .from("ratings")
          .select("*")
          .eq("project_name", projectName)
          .eq("assessment_date", assessmentDate)
          .eq("pillar_title", "People")
          .eq("practice_name", "Collaboration");

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          console.log("Loaded collaboration ratings:", ratings);
          const savedAspects = [...initialAspects];
          ratings.forEach(rating => {
            const aspectName = rating.practice_name.replace("Collaboration:", "");
            const aspectIndex = savedAspects.findIndex(
              aspect => aspect.name === aspectName
            );
            if (aspectIndex !== -1 && rating.rating) {
              savedAspects[aspectIndex].rating = rating.rating as RatingLevel;
            }
          });
          setAspects(savedAspects);
        }
      } catch (error) {
        console.error("Error loading collaboration ratings:", error);
        toast.error("Failed to load ratings");
      }
    };

    loadRatings();
  }, [projectName, assessmentDate]);

  const handleAspectClick = (index: number) => {
    const ratings: RatingLevel[] = [
      "Largely in Place",
      "Somewhat in Place",
      "Not in Place"
    ];
    
    const currentRating = aspects[index].rating;
    const currentIndex = currentRating ? ratings.indexOf(currentRating) : -1;
    const nextRating = ratings[(currentIndex + 1) % ratings.length];
    
    const newAspects = [...aspects];
    newAspects[index] = { ...aspects[index], rating: nextRating };
    setAspects(newAspects);
  };

  return {
    aspects,
    handleAspectClick,
    setAspects
  };
};