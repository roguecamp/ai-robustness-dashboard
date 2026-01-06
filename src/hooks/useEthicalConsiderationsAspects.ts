import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { EthicalConsiderationsAspect } from "@/types/ethical-considerations";

const initialAspects: EthicalConsiderationsAspect[] = [
  {
    name: "Ethics Guidelines",
    description: "Defined and communicated AI ethics guidelines.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Ethics Board",
    description: "An established board to review and approve AI projects for ethical considerations.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Ethical Training",
    description: "Training on AI ethics for relevant stakeholders.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Ethical Audits",
    description: "Regular audits to ensure AI solutions adhere to ethical guidelines.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Bias Mitigation",
    description: "Processes to identify and mitigate unintentional biases in AI systems.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Transparency",
    description: "Transparency to stakeholders on how AI systems operate and make decisions.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Public Engagement",
    description: "Engagement with the public or external experts on AI ethics.",
    rating: null,
    findings: "",
    owners: ""
  }
];

export const useEthicalConsiderationsAspects = (projectName: string | null, assessmentDate: string | null) => {
  const [aspects, setAspects] = useState<EthicalConsiderationsAspect[]>(initialAspects);

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
          .eq("pillar_title", "Legal")
          .like("practice_name", "EthicalConsiderations:%");

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          const updatedAspects = initialAspects.map(aspect => {
            const matchingRating = ratings.find(r => r.practice_name === `EthicalConsiderations:${aspect.name}`);
            return {
              ...aspect,
              rating: matchingRating?.rating as EthicalConsiderationsAspect["rating"] || null,
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

    const ratings: EthicalConsiderationsAspect["rating"][] = [
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
          pillar_title: "Legal",
          practice_name: `EthicalConsiderations:${aspects[index].name}`,
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
          pillar_title: "Legal",
          practice_name: `EthicalConsiderations:${aspects[index].name}`,
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
          pillar_title: "Legal",
          practice_name: `EthicalConsiderations:${aspects[index].name}`,
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
