import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ScalabilityAspect } from "@/types/scalability";

const initialAspects: ScalabilityAspect[] = [
  {
    name: "Scalability Planning",
    description: "Strategies and plans for scaling AI solutions across the organization.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Resource Allocation",
    description: "Adequate allocation of resources (budget, personnel, infrastructure) for scaling.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Adoption Metrics",
    description: "Metrics to track and measure AI adoption across business units.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Change Readiness",
    description: "Organization's readiness to adopt and scale AI solutions.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Integration Capabilities",
    description: "Ability to integrate AI solutions with existing systems and workflows.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Pilot Programs",
    description: "Effectiveness of pilot programs in validating scalability.",
    rating: null,
    findings: "",
    owners: ""
  },
  {
    name: "Enterprise Rollout",
    description: "Plans and processes for enterprise-wide AI solution deployment.",
    rating: null,
    findings: "",
    owners: ""
  }
];

export const useScalabilityAspects = (projectName: string | null, assessmentDate: string | null) => {
  const [aspects, setAspects] = useState<ScalabilityAspect[]>(initialAspects);

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
          .like('practice_name', 'Scalability:%');

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          const updatedAspects = initialAspects.map(aspect => {
            const matchingRating = ratings.find(r => r.practice_name === `Scalability:${aspect.name}`);
            return {
              ...aspect,
              rating: matchingRating?.rating as ScalabilityAspect["rating"] || null,
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

    const ratings: ScalabilityAspect["rating"][] = [
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
          practice_name: `Scalability:${aspects[index].name}`,
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
          practice_name: `Scalability:${aspects[index].name}`,
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
          practice_name: `Scalability:${aspects[index].name}`,
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
