import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { DataGovernanceAspect } from "@/types/data-governance";

const initialAspects: DataGovernanceAspect[] = [
  {
    name: "Data Governance Framework",
    description: "Established data governance framework with clear policies and procedures.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Data Stewardship",
    description: "Defined data ownership and stewardship roles.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Data Quality",
    description: "Processes to ensure and enhance data quality.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Data Access Controls",
    description: "Role-based access controls to restrict data access.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Data Lifecycle Management",
    description: "Managing data throughout its lifecycle from collection to deletion.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Data Security",
    description: "Security measures to protect data from unauthorized access.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Data Privacy",
    description: "Ensuring data privacy compliance and protection.",
    rating: null,
    findings: "",
    owners: ""
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
          .select("*")
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
              rating: matchingRating?.rating as DataGovernanceAspect["rating"] || null,
              findings: matchingRating?.findings || "",
              owners: (matchingRating as any)?.owners || ""
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

  const handleAspectClick = async (index: number) => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    const ratings: DataGovernanceAspect["rating"][] = [
      "Largely in Place",
      "Somewhat in Place",
      "Not in Place"
    ];
    
    const currentRating = aspects[index].rating;
    const currentIndex = currentRating ? ratings.indexOf(currentRating) : -1;
    const nextRating = ratings[(currentIndex + 1) % ratings.length];
    
    try {
      const { error } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Data",
          practice_name: `DataGovernance:${aspects[index].name}`,
          rating: nextRating,
          findings: aspects[index].findings,
          owners: aspects[index].owners
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (error) throw error;

      const updatedAspects = [...aspects];
      updatedAspects[index] = { ...aspects[index], rating: nextRating };
      setAspects(updatedAspects);
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
      const { error } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Data",
          practice_name: `DataGovernance:${aspects[index].name}`,
          rating: aspects[index].rating,
          findings: findings,
          owners: aspects[index].owners
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (error) throw error;

      const updatedAspects = [...aspects];
      updatedAspects[index] = { ...aspects[index], findings };
      setAspects(updatedAspects);
    } catch (error) {
      console.error("Error updating findings:", error);
      toast.error("Failed to update findings");
    }
  };

  const handleOwnersChange = async (index: number, owners: string) => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    try {
      const { error } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Data",
          practice_name: `DataGovernance:${aspects[index].name}`,
          rating: aspects[index].rating,
          findings: aspects[index].findings,
          owners: owners
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (error) throw error;

      const updatedAspects = [...aspects];
      updatedAspects[index] = { ...aspects[index], owners };
      setAspects(updatedAspects);
    } catch (error) {
      console.error("Error updating owners:", error);
      toast.error("Failed to update owners");
    }
  };

  return {
    aspects,
    isLoading,
    handleAspectClick,
    handleFindingsChange,
    handleOwnersChange
  };
};
