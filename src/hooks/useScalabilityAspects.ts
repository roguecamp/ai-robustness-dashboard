import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ScalabilityAspect } from "@/types/scalability";

const initialAspects: ScalabilityAspect[] = [
  {
    name: "Data Collection",
    description: "Data Needed is sourced and available",
    rating: null,
    findings: ""
  },
  {
    name: "Data Quality Metrics",
    description: "Confirm the Data trustworthy to use",
    rating: null,
    findings: ""
  },
  {
    name: "Data Validation",
    description: "Processes for validating and cleaning data.",
    rating: null,
    findings: ""
  },
  {
    name: "Data Annotation",
    description: "Tools and processes for annotating data, if necessary.",
    rating: null,
    findings: ""
  },
  {
    name: "Data Updates and Relevance",
    description: "Regular updates to ensure data relevance to solutions.",
    rating: null,
    findings: ""
  },
  {
    name: "Data Structure",
    description: "Structured and labeling requirements or use of unstructured data",
    rating: null,
    findings: ""
  },
  {
    name: "Source Diversity",
    description: "Variety in data sources to ensure comprehensive data collection.",
    rating: null,
    findings: ""
  }
];

export const useScalabilityAspects = (projectName: string | null, assessmentDate: string | null) => {
  const [aspects, setAspects] = useState<ScalabilityAspect[]>(initialAspects);

  useEffect(() => {
    const loadAspectRatings = async () => {
      if (!projectName || !assessmentDate) return;

      try {
        const { data: ratings, error } = await supabase
          .from('ratings')
          .select('practice_name, rating, findings')
          .eq('project_name', projectName)
          .eq('assessment_date', assessmentDate)
          .eq('pillar_title', 'Strategy')
          .like('practice_name', 'Scalability:%');

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          const updatedAspects = aspects.map(aspect => {
            const matchingRating = ratings.find(r => r.practice_name === `Scalability:${aspect.name}`);
            return {
              ...aspect,
              rating: matchingRating?.rating as ScalabilityAspect["rating"] || null,
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
    const ratings: ScalabilityAspect["rating"][] = [
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
    handleFindingsChange
  };
};