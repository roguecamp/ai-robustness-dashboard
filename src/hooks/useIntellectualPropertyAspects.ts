import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { IntellectualPropertyAspect } from "@/types/intellectual-property";
import type { RatingLevel } from "@/types/ratings";

const initialAspects: IntellectualPropertyAspect[] = [
  {
    name: "IP Policies",
    description: "Clearly defined policies regarding AI-generated content and data.",
    rating: "Not in Place",
    findings: ""
  },
  {
    name: "Contract Clarity",
    description: "Clear contracts regarding IP ownership with third-party vendors.",
    rating: "Not in Place",
    findings: ""
  },
  {
    name: "IP Protection",
    description: "Mechanisms for protecting AI-generated IP.",
    rating: "Not in Place",
    findings: ""
  },
  {
    name: "Licensing Agreements",
    description: "Proper licensing agreements for AI technologies and datasets.",
    rating: "Not in Place",
    findings: ""
  },
  {
    name: "Legal Review",
    description: "Regular legal review of IP issues related to AI.",
    rating: "Not in Place",
    findings: ""
  },
  {
    name: "IP Education",
    description: "Training on IP considerations for relevant stakeholders.",
    rating: "Not in Place",
    findings: ""
  },
  {
    name: "IP Compliance",
    description: "Monitoring and ensuring compliance with IP policies and laws.",
    rating: "Not in Place",
    findings: ""
  }
];

export const useIntellectualPropertyAspects = (projectName: string | null, assessmentDate: string | null) => {
  const [aspects, setAspects] = useState<IntellectualPropertyAspect[]>(initialAspects);

  useEffect(() => {
    const loadRatings = async () => {
      if (!projectName || !assessmentDate) return;

      try {
        console.log("Loading IP aspect ratings for:", projectName, assessmentDate);
        const { data: ratings, error } = await supabase
          .from("ratings")
          .select("*")
          .eq("project_name", projectName)
          .eq("assessment_date", assessmentDate)
          .eq("pillar_title", "Legal")
          .like("practice_name", 'IntellectualProperty:%');

        if (error) throw error;

        console.log("Loaded IP aspect ratings:", ratings);

        if (ratings && ratings.length > 0) {
          const savedAspects = [...initialAspects];
          ratings.forEach(rating => {
            const aspectName = rating.practice_name.replace("IntellectualProperty:", "");
            const aspectIndex = savedAspects.findIndex(
              aspect => aspect.name === aspectName
            );
            if (aspectIndex !== -1) {
              savedAspects[aspectIndex].rating = rating.rating as RatingLevel;
              savedAspects[aspectIndex].findings = rating.findings || "";
            }
          });
          setAspects(savedAspects);
        }
      } catch (error) {
        console.error("Error loading IP aspect ratings:", error);
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
    const currentIndex = ratings.indexOf(currentRating);
    const nextRating = ratings[(currentIndex + 1) % ratings.length];
    
    try {
      const { error: aspectError } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Legal",
          practice_name: `IntellectualProperty:${aspects[index].name}`,
          rating: nextRating,
          findings: aspects[index].findings
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (aspectError) throw aspectError;

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
      const { error: aspectError } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Legal",
          practice_name: `IntellectualProperty:${aspects[index].name}`,
          rating: aspects[index].rating,
          findings: findings
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (aspectError) throw aspectError;

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
    setAspects
  };
};