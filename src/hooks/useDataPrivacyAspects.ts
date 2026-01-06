import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { DataPrivacyAspect } from "@/types/data-privacy";

const initialAspects: DataPrivacyAspect[] = [
  {
    name: "Privacy Policies",
    description: "Established and communicated data privacy policies.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Privacy Measures",
    description: "Categorize levels of data privacy.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Compliance with Laws",
    description: "Compliance with data protection laws and regulations (e.g., GDPR, CCPA).",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Data Encryption",
    description: "Encryption of sensitive data both in transit and at rest.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Access Controls",
    description: "Role-based access controls to restrict data access.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Privacy Auditing",
    description: "Test for or scan potential privacy issues in your data.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Incident Response",
    description: "Effective incident response plans for data breaches compromising privacy.",
    rating: null,
    findings: "",
    owners: ""
  }
];

export const useDataPrivacyAspects = (projectName: string | null, assessmentDate: string | null) => {
  const [aspects, setAspects] = useState<DataPrivacyAspect[]>(initialAspects);

  useEffect(() => {
    const loadAspectRatings = async () => {
      if (!projectName || !assessmentDate) {
        setAspects(initialAspects);
        return;
      }

      try {
        const { data: ratings, error } = await supabase
          .from("ratings")
          .select("*")
          .eq("project_name", projectName)
          .eq("assessment_date", assessmentDate)
          .eq("pillar_title", "Data")
          .like("practice_name", "DataPrivacy:%");

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          const updatedAspects = initialAspects.map(aspect => {
            const matchingRating = ratings.find(r => r.practice_name === `DataPrivacy:${aspect.name}`);
            return {
              ...aspect,
              rating: matchingRating?.rating as DataPrivacyAspect["rating"] || null,
              findings: matchingRating?.findings || "",
              owners: matchingRating?.owners || ""
            };
          });
          setAspects(updatedAspects);
        } else {
          setAspects(initialAspects);
        }
      } catch (error) {
        console.error("Error loading ratings:", error);
        toast.error("Failed to load aspect ratings");
        setAspects(initialAspects);
      }
    };

    loadAspectRatings();
  }, [projectName, assessmentDate]);

  const handleAspectClick = async (index: number) => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    const ratings: DataPrivacyAspect["rating"][] = [
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
          practice_name: `DataPrivacy:${aspects[index].name}`,
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
          practice_name: `DataPrivacy:${aspects[index].name}`,
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
          practice_name: `DataPrivacy:${aspects[index].name}`,
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
    handleAspectClick,
    handleFindingsChange,
    handleOwnersChange
  };
};
