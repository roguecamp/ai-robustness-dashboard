import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { CollaborationAspect } from "@/types/collaboration";
import type { RatingLevel } from "@/types/ratings";

const initialAspects: CollaborationAspect[] = [
  {
    name: "Interdisciplinary Teams",
    description: "Existance and effectiveness of cross-functional teams.",
    rating: null
  },
  {
    name: "External Partnerships",
    description: "Relationships with external AI consultants, vendors, and academic institutions.",
    rating: null
  },
  {
    name: "Collaboration Tools",
    description: "Availability and utilization of collaboration tools",
    rating: null
  },
  {
    name: "Knowledge Sharing",
    description: "Platforms and practices for sharing AI knowledge across the organization",
    rating: null
  },
  {
    name: "Project Management",
    description: "Effectiuveness in managing AI projects across different teams.",
    rating: null
  },
  {
    name: "Innovation Culture",
    description: "Encouragement and support for innovative ideas and experimentation.",
    rating: null
  },
  {
    name: "Feedback Loops",
    description: "Mechanisms for collecting and acting on feedback from various stakeholders.",
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
          .like("practice_name", 'Collaboration:%');

        if (error) throw error;

        console.log("Loaded collaboration ratings:", ratings);

        if (ratings && ratings.length > 0) {
          const savedAspects = [...initialAspects];
          ratings.forEach(rating => {
            const aspectName = rating.practice_name.replace("Collaboration:", "");
            const aspectIndex = savedAspects.findIndex(
              aspect => aspect.name === aspectName
            );
            if (aspectIndex !== -1) {
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

  const handleAspectClick = async (index: number) => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    const ratings: RatingLevel[] = [
      "Largely in Place",
      "Somewhat in Place",
      "Not in Place"
    ];
    
    const currentRating = aspects[index].rating;
    const currentIndex = currentRating ? ratings.indexOf(currentRating) : -1;
    const nextRating = ratings[(currentIndex + 1) % ratings.length];
    
    try {
      // Save the individual aspect rating
      const { error: aspectError } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "People",
          practice_name: `Collaboration:${aspects[index].name}`,
          rating: nextRating
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (aspectError) throw aspectError;

      // Update local state
      const newAspects = [...aspects];
      newAspects[index] = { ...aspects[index], rating: nextRating };
      setAspects(newAspects);

      console.log(`Updated aspect ${aspects[index].name} to ${nextRating}`);
    } catch (error) {
      console.error("Error updating aspect rating:", error);
      toast.error("Failed to update rating");
    }
  };

  return {
    aspects,
    handleAspectClick,
    setAspects
  };
};