import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { DataGovernanceAspect } from "@/types/data-governance";

const initialAspects: DataGovernanceAspect[] = [
  {
    name: "Governance Framework",
    description: "Established data governance framework with clear policies and procedures.",
    rating: null
  },
  {
    name: "Data Ownership",
    description: "Defined data ownership and stewardship roles.",
    rating: null
  },
  {
    name: "Metadata Management",
    description: "Effective metadata management for data discoverability and understanding.",
    rating: null
  },
  {
    name: "Data Quality Management",
    description: "Processes to ensure and enhance data quality.",
    rating: null
  },
  {
    name: "Data Lifecycle Management",
    description: "Managing data throughout its lifecycle from collection to deletion.",
    rating: null
  },
  {
    name: "Data Governance Tools",
    description: "Tools to enforce data governance policies.",
    rating: null
  },
  {
    name: "Compliance Monitoring",
    description: "Monitoring and ensuring compliance with data governance policies.",
    rating: null
  }
];

export const useDataGovernanceAspects = (projectName: string | null, assessmentDate: string | null) => {
  const [aspects, setAspects] = useState<DataGovernanceAspect[]>(initialAspects);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAspectRatings = async () => {
      if (!projectName || !assessmentDate) {
        setIsLoading(false);
        return;
      }

      try {
        console.log("Loading data governance ratings for:", projectName, assessmentDate);
        const { data: ratings, error } = await supabase
          .from("ratings")
          .select("practice_name, rating")
          .eq("project_name", projectName)
          .eq("assessment_date", assessmentDate)
          .eq("pillar_title", "Data")
          .like("practice_name", "DataGovernance:%");

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          console.log("Loaded data governance ratings:", ratings);
          const updatedAspects = aspects.map(aspect => {
            const matchingRating = ratings.find(r => r.practice_name === `DataGovernance:${aspect.name}`);
            return {
              ...aspect,
              rating: matchingRating?.rating as DataGovernanceAspect["rating"] || null
            };
          });
          setAspects(updatedAspects);
        }
      } catch (error) {
        console.error("Error loading ratings:", error);
        toast.error("Failed to load aspect ratings");
      } finally {
        setIsLoading(false);
      }
    };

    loadAspectRatings();
  }, [projectName, assessmentDate]);

  const handleAspectClick = (index: number) => {
    const ratings: DataGovernanceAspect["rating"][] = [
      "Largely in Place",
      "Somewhat in Place",
      "Not in Place"
    ];
    
    const updatedAspects = [...aspects];
    const currentRating = aspects[index].rating;
    const currentIndex = currentRating ? ratings.indexOf(currentRating) : -1;
    const nextIndex = (currentIndex + 1) % ratings.length;
    
    updatedAspects[index] = {
      ...aspects[index],
      rating: ratings[nextIndex]
    };
    
    setAspects(updatedAspects);
  };

  return {
    aspects,
    isLoading,
    handleAspectClick
  };
};