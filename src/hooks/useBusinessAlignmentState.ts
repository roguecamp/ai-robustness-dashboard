import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { BusinessAlignmentAspect } from "@/types/business-alignment";
import type { RatingLevel } from "@/types/ratings";

const initialAspects: BusinessAlignmentAspect[] = [
  {
    name: "Business Objectives",
    description: "Clear definition of how AI aligns with overall business objectives.",
    rating: null,
    findings: ""
  },
  {
    name: "Value Proposition",
    description: "Demonstrated value provided by Generative AI solutions.",
    rating: null,
    findings: ""
  },
  {
    name: "ROI Measurement",
    description: "Metrics and methods for measuring ROI of AI initiatives.",
    rating: null,
    findings: ""
  },
  {
    name: "Alignment Meetings",
    description: "Regular alignment meetings between AI teams and business stakeholders.",
    rating: null,
    findings: ""
  },
  {
    name: "Use Case Identification",
    description: "Effective processes for identifying and prioritizing AI use cases.",
    rating: null,
    findings: ""
  },
  {
    name: "AI Roadmap",
    description: "A well-defined roadmap detailing AI implementation phases.",
    rating: null,
    findings: ""
  },
  {
    name: "Stakeholder Buy-in",
    description: "Level of support from key stakeholders across the organization.",
    rating: null,
    findings: ""
  }
];

export const useBusinessAlignmentAspects = (projectName: string | null, assessmentDate: string | null) => {
  const [aspects, setAspects] = useState<BusinessAlignmentAspect[]>(initialAspects);

  useEffect(() => {
    const loadRatings = async () => {
      if (!projectName || !assessmentDate) return;

      try {
        console.log("Loading business alignment ratings for:", projectName, assessmentDate);
        const { data: ratings, error } = await supabase
          .from("ratings")
          .select("*")
          .eq("project_name", projectName)
          .eq("assessment_date", assessmentDate)
          .eq("pillar_title", "Strategy")
          .like("practice_name", "Business:%");

        if (error) throw error;

        console.log("Loaded ratings:", ratings);

        if (ratings && ratings.length > 0) {
          const savedAspects = [...initialAspects];
          ratings.forEach(rating => {
            const practiceName = rating.practice_name.replace("Business:", "");
            const aspectIndex = savedAspects.findIndex(
              aspect => aspect.name === practiceName
            );

            if (aspectIndex !== -1) {
              console.log(`Found matching aspect at index ${aspectIndex}:`, savedAspects[aspectIndex].name);
              savedAspects[aspectIndex] = {
                ...savedAspects[aspectIndex],
                rating: rating.rating as RatingLevel || null,
                findings: rating.findings || ""
              };
            }
          });
          setAspects(savedAspects);
        }
      } catch (error) {
        console.error("Error loading ratings:", error);
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
      // First try to update if the record exists
      const { data: existingData, error: selectError } = await supabase
        .from("ratings")
        .select("*")
        .eq("project_name", projectName)
        .eq("assessment_date", assessmentDate)
        .eq("pillar_title", "Strategy")
        .eq("practice_name", `Business:${aspects[index].name}`)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        throw selectError;
      }

      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("ratings")
          .update({
            rating: nextRating,
            findings: aspects[index].findings
          })
          .eq("project_name", projectName)
          .eq("assessment_date", assessmentDate)
          .eq("pillar_title", "Strategy")
          .eq("practice_name", `Business:${aspects[index].name}`);

        if (updateError) throw updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from("ratings")
          .insert({
            project_name: projectName,
            assessment_date: assessmentDate,
            pillar_title: "Strategy",
            practice_name: `Business:${aspects[index].name}`,
            rating: nextRating,
            findings: aspects[index].findings
          });

        if (insertError) throw insertError;
      }

      const newAspects = [...aspects];
      newAspects[index] = { ...aspects[index], rating: nextRating };
      setAspects(newAspects);

      console.log(`Updated aspect ${aspects[index].name} to ${nextRating}`);
    } catch (error) {
      console.error("Error updating aspect rating:", error);
      toast.error("Failed to update rating");
    }
  };

  const handleFindingsChange = async (index: number, findings: string) => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    try {
      // First try to update if the record exists
      const { data: existingData, error: selectError } = await supabase
        .from("ratings")
        .select("*")
        .eq("project_name", projectName)
        .eq("assessment_date", assessmentDate)
        .eq("pillar_title", "Strategy")
        .eq("practice_name", `Business:${aspects[index].name}`)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        throw selectError;
      }

      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("ratings")
          .update({
            findings: findings,
            rating: aspects[index].rating
          })
          .eq("project_name", projectName)
          .eq("assessment_date", assessmentDate)
          .eq("pillar_title", "Strategy")
          .eq("practice_name", `Business:${aspects[index].name}`);

        if (updateError) throw updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from("ratings")
          .insert({
            project_name: projectName,
            assessment_date: assessmentDate,
            pillar_title: "Strategy",
            practice_name: `Business:${aspects[index].name}`,
            rating: aspects[index].rating,
            findings: findings
          });

        if (insertError) throw insertError;
      }

      const newAspects = [...aspects];
      newAspects[index] = { ...aspects[index], findings };
      setAspects(newAspects);

      console.log(`Updated findings for ${aspects[index].name}`);
    } catch (error) {
      console.error("Error updating findings:", error);
      toast.error("Failed to update findings");
    }
  };

  return {
    aspects,
    handleAspectClick,
    handleFindingsChange,
  };
};