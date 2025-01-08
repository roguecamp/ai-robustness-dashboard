import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { DataPrivacyAspect } from "@/types/data-privacy";

const initialAspects: DataPrivacyAspect[] = [
  {
    name: "Privacy Policies",
    description: "Established and communicated data privacy policies.",
    rating: null,
    findings: ""
  },
  {
    name: "Privacy Measures",
    description: "Categorize levels of data privacy.",
    rating: null,
    findings: ""
  },
  {
    name: "Compliance with Laws",
    description: "Compliance with data protection laws and regulations (e.g., GDPR, CCPA).",
    rating: null,
    findings: ""
  },
  {
    name: "Data Encryption",
    description: "Encryption of sensitive data both in transit and at rest.",
    rating: null,
    findings: ""
  },
  {
    name: "Access Controls",
    description: "Role-based access controls to restrict data access.",
    rating: null,
    findings: ""
  },
  {
    name: "Privacy Auditing",
    description: "Test for or scan potential privacy issues in your data.",
    rating: null,
    findings: ""
  },
  {
    name: "Incident Response",
    description: "Effective incident response plans for data breaches compromising privacy.",
    rating: null,
    findings: ""
  }
];

export const useDataPrivacyAspects = (projectName: string | null, assessmentDate: string | null) => {
  const [aspects, setAspects] = useState<DataPrivacyAspect[]>(initialAspects);

  useEffect(() => {
    const loadAspectRatings = async () => {
      if (!projectName || !assessmentDate) return;

      try {
        const { data: ratings, error } = await supabase
          .from("ratings")
          .select("practice_name, rating, findings")
          .eq("project_name", projectName)
          .eq("assessment_date", assessmentDate)
          .eq("pillar_title", "Data")
          .like("practice_name", "DataPrivacy:%");

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          const updatedAspects = aspects.map(aspect => {
            const matchingRating = ratings.find(r => r.practice_name === `DataPrivacy:${aspect.name}`);
            return {
              ...aspect,
              rating: matchingRating?.rating as DataPrivacyAspect["rating"] || null,
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
    const ratings: DataPrivacyAspect["rating"][] = [
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