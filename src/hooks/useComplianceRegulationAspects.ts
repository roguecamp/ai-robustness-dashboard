import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { ComplianceRegulationAspect } from "@/types/compliance-regulation";

const initialAspects: ComplianceRegulationAspect[] = [
  {
    name: "Regulatory Awareness",
    description: "Staying updated on local and global AI regulations.",
    rating: null,
    findings: ""
  },
  {
    name: "Compliance Monitoring",
    description: "Processes to ensure AI solutions are compliant with relevant regulations.",
    rating: null,
    findings: ""
  },
  {
    name: "Legal Support",
    description: "Access to legal support for AI compliance and regulation issues.",
    rating: null,
    findings: ""
  },
  {
    name: "Documentation",
    description: "Proper documentation for AI systems to demonstrate compliance.",
    rating: null,
    findings: ""
  },
  {
    name: "Regulatory Engagement",
    description: "Engaging with regulatory bodies and participating in industry groups.",
    rating: null,
    findings: ""
  },
  {
    name: "Audit Trails",
    description: "Maintaining audit trails for critical AI decisions and actions.",
    rating: null,
    findings: ""
  },
  {
    name: "Reporting Mechanisms",
    description: "Effective reporting mechanisms to report compliance status to stakeholders.",
    rating: null,
    findings: ""
  }
];

export const useComplianceRegulationAspects = (projectName: string | null, assessmentDate: string | null) => {
  const [aspects, setAspects] = useState<ComplianceRegulationAspect[]>(initialAspects);

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
          .like("practice_name", "ComplianceRegulation:%");

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          const updatedAspects = aspects.map(aspect => {
            const matchingRating = ratings.find(r => r.practice_name === `ComplianceRegulation:${aspect.name}`);
            return {
              ...aspect,
              rating: matchingRating?.rating as ComplianceRegulationAspect["rating"] || null,
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
    const ratings: ComplianceRegulationAspect["rating"][] = [
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