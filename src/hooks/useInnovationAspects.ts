import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { InnovationAspect } from "@/types/innovation";

const initialAspects: InnovationAspect[] = [
  {
    name: "Innovation Labs",
    description: "Existence and utilization of innovation labs for testing AI solutions.",
    rating: null,
    findings: ""
  },
  {
    name: "Agile Methodology",
    description: "Adoption of agile methodologies in AI development cycles.",
    rating: null,
    findings: ""
  },
  {
    name: "Proof of Concept (POC) Processes",
    description: "Structured processes for developing and evaluating POCs.",
    rating: null,
    findings: ""
  },
  {
    name: "Risk Tolerance",
    description: "Willingness to invest in innovative but risky AI projects.",
    rating: null,
    findings: ""
  },
  {
    name: "Idea Generation",
    description: "Processes for generating and evaluating new AI ideas.",
    rating: null,
    findings: ""
  },
  {
    name: "Experimentation Culture",
    description: "Encouragement of experimentation and learning from failures.",
    rating: null,
    findings: ""
  },
  {
    name: "Scalability Assessments",
    description: "Processes to assess the scalability of innovative solutions.",
    rating: null,
    findings: ""
  }
];

export const useInnovationAspects = (projectName: string | null, assessmentDate: string | null) => {
  const [aspects, setAspects] = useState<InnovationAspect[]>(initialAspects);

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
          .like('practice_name', 'Innovation:%');

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          const updatedAspects = aspects.map(aspect => {
            const matchingRating = ratings.find(r => r.practice_name === `Innovation:${aspect.name}`);
            return {
              ...aspect,
              rating: matchingRating?.rating as InnovationAspect["rating"] || null,
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
    const ratings: InnovationAspect["rating"][] = [
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