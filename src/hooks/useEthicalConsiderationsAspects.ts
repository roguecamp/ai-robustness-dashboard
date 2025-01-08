import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { EthicalConsiderationsAspect } from "@/types/ethical-considerations";

const initialAspects: EthicalConsiderationsAspect[] = [
  {
    name: "Ethics Guidelines",
    description: "Defined and communicated AI ethics guidelines.",
    rating: null,
    findings: ""
  },
  {
    name: "Ethics Board",
    description: "An established board to review and approve AI projects for ethical considerations.",
    rating: null,
    findings: ""
  },
  {
    name: "Ethical Training",
    description: "Training on AI ethics for relevant stakeholders.",
    rating: null,
    findings: ""
  },
  {
    name: "Ethical Audits",
    description: "Regular audits to ensure AI solutions adhere to ethical guidelines.",
    rating: null,
    findings: ""
  },
  {
    name: "Bias Mitigation",
    description: "Processes to identify and mitigate unintentional biases in AI systems.",
    rating: null,
    findings: ""
  },
  {
    name: "Transparency",
    description: "Transparency to stakeholders on how AI systems operate and make decisions.",
    rating: null,
    findings: ""
  },
  {
    name: "Public Engagement",
    description: "Engagement with the public or external experts on AI ethics.",
    rating: null,
    findings: ""
  }
];

export const useEthicalConsiderationsAspects = (projectName: string | null, assessmentDate: string | null) => {
  const [aspects, setAspects] = useState<EthicalConsiderationsAspect[]>(initialAspects);

  useEffect(() => {
    const loadAspectRatings = async () => {
      if (!projectName || !assessmentDate) return;

      try {
        const { data: ratings, error } = await supabase
          .from("ratings")
          .select("practice_name, rating, findings")
          .eq("project_name", projectName)
          .eq("assessment_date", assessmentDate)
          .eq("pillar_title", "Legal")
          .like("practice_name", "EthicalConsiderations:%");

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          const updatedAspects = aspects.map(aspect => {
            const matchingRating = ratings.find(r => r.practice_name === `EthicalConsiderations:${aspect.name}`);
            return {
              ...aspect,
              rating: matchingRating?.rating as EthicalConsiderationsAspect["rating"] || null,
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

  const handleAspectClick = async (index: number) => {
    const ratings: EthicalConsiderationsAspect["rating"][] = [
      "Largely in Place",
      "Somewhat in Place",
      "Not in Place"
    ];
    
    const currentRating = aspects[index].rating;
    const currentIndex = currentRating ? ratings.indexOf(currentRating) : -1;
    const nextRating = ratings[(currentIndex + 1) % ratings.length];
    
    const updatedAspects = [...aspects];
    updatedAspects[index] = {
      ...aspects[index],
      rating: nextRating
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