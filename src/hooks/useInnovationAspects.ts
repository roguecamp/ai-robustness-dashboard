import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { InnovationAspect } from "@/types/innovation";

const initialAspects: InnovationAspect[] = [
  {
    name: "Innovation Labs",
    description: "Existence and utilization of innovation labs for testing AI solutions.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Agile Methodology",
    description: "Adoption of agile methodologies in AI development cycles.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Proof of Concept (POC) Processes",
    description: "Structured processes for developing and evaluating POCs.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Risk Tolerance",
    description: "Willingness to invest in innovative but risky AI projects.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Idea Generation",
    description: "Processes for generating and evaluating new AI ideas.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Experimentation Culture",
    description: "Encouragement of experimentation and learning from failures.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Scalability Assessments",
    description: "Processes to assess the scalability of innovative solutions.",
    rating: null,
    findings: "",
    owners: ""
  }
];

export const useInnovationAspects = (projectName: string | null, assessmentDate: string | null) => {
  const [aspects, setAspects] = useState<InnovationAspect[]>(initialAspects);

  useEffect(() => {
    const loadAspectRatings = async () => {
      if (!projectName || !assessmentDate) {
        setAspects(initialAspects);
        return;
      }

      try {
        const { data: ratings, error } = await supabase
          .from('ratings')
          .select('*')
          .eq('project_name', projectName)
          .eq('assessment_date', assessmentDate)
          .eq('pillar_title', 'Strategy')
          .like('practice_name', 'Innovation:%');

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          const updatedAspects = initialAspects.map(aspect => {
            const matchingRating = ratings.find(r => r.practice_name === `Innovation:${aspect.name}`);
            return {
              ...aspect,
              rating: matchingRating?.rating as InnovationAspect["rating"] || null,
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

    const ratings: InnovationAspect["rating"][] = [
      "Largely in Place",
      "Somewhat in Place",
      "Not in Place"
    ];
    
    const currentRating = aspects[index].rating;
    const currentIndex = currentRating ? ratings.indexOf(currentRating) : -1;
    const nextRating = ratings[(currentIndex + 1) % ratings.length];
    
    try {
      const { error } = await supabase
        .from('ratings')
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: 'Strategy',
          practice_name: `Innovation:${aspects[index].name}`,
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
        .from('ratings')
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: 'Strategy',
          practice_name: `Innovation:${aspects[index].name}`,
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
        .from('ratings')
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: 'Strategy',
          practice_name: `Innovation:${aspects[index].name}`,
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
