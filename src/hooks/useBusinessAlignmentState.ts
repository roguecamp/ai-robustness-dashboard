import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { BusinessAlignmentAspect } from "@/types/business-alignment";
import { calculateOverallRating } from "@/utils/businessAlignmentScoring";

const initialAspects: BusinessAlignmentAspect[] = [
  {
    name: "Business Objectives",
    description: "Clear definition of how AI aligns with overall business objectives.",
    rating: null,
    findings: ""
  },
  {
    name: "Value Proposition",
    description: "Demonstrated value provided by Generative AI solutions.",
    rating: null,
    findings: ""
  },
  {
    name: "ROI Measurement",
    description: "Metrics and methods for measuring ROI of AI initiatives.",
    rating: null,
    findings: ""
  },
  {
    name: "Alignment Meetings",
    description: "Regular alignment meetings between AI teams and business stakeholders.",
    rating: null,
    findings: ""
  },
  {
    name: "Use Case Identification",
    description: "Effective processes for identifying and prioritizing AI use cases.",
    rating: null,
    findings: ""
  },
  {
    name: "AI Roadmap",
    description: "A well-defined roadmap detailing AI implementation phases.",
    rating: null,
    findings: ""
  },
  {
    name: "Stakeholder Buy-in",
    description: "Level of support from key stakeholders across the organization.",
    rating: null,
    findings: ""
  }
];

export const useBusinessAlignmentState = (projectName: string | null, assessmentDate: string | null) => {
  const [aspects, setAspects] = useState<BusinessAlignmentAspect[]>(initialAspects);

  useEffect(() => {
    loadAspects();
  }, [projectName, assessmentDate]);

  const loadAspects = async () => {
    if (!projectName || !assessmentDate) return;

    try {
      console.log("Loading business alignment ratings for:", projectName, assessmentDate);
      const { data: ratings, error } = await supabase
        .from("ratings")
        .select("*")
        .eq("project_name", projectName)
        .eq("assessment_date", assessmentDate)
        .eq("pillar_title", "Strategy")
        .like("practice_name", "BusinessAlignment:%");

      if (error) throw error;

      if (ratings && ratings.length > 0) {
        console.log("Loaded business alignment ratings:", ratings);
        const savedAspects = [...initialAspects];
        ratings.forEach(rating => {
          const aspectName = rating.practice_name.replace("BusinessAlignment:", "");
          const aspectIndex = savedAspects.findIndex(
            aspect => aspect.name === aspectName
          );
          if (aspectIndex !== -1) {
            savedAspects[aspectIndex].rating = rating.rating as BusinessAlignmentAspect["rating"];
            savedAspects[aspectIndex].findings = rating.findings || "";
          }
        });
        setAspects(savedAspects);
      }
    } catch (error) {
      console.error("Error loading ratings:", error);
      toast.error("Failed to load ratings");
    }
  };

  const handleAspectClick = async (index: number) => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    const ratings: BusinessAlignmentAspect["rating"][] = [
      "Largely in Place",
      "Somewhat in Place",
      "Not in Place"
    ];
    
    const currentRating = aspects[index].rating;
    const currentIndex = currentRating ? ratings.indexOf(currentRating) : -1;
    const nextRating = ratings[(currentIndex + 1) % ratings.length];

    try {
      const { error: aspectError } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Strategy",
          practice_name: `BusinessAlignment:${aspects[index].name}`,
          rating: nextRating,
          findings: aspects[index].findings
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (aspectError) throw aspectError;

      const newAspects = [...aspects];
      newAspects[index] = { ...aspects[index], rating: nextRating };
      setAspects(newAspects);

      console.log(`Updated aspect ${aspects[index].name} to ${nextRating}`);
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
      const { error: aspectError } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Strategy",
          practice_name: `BusinessAlignment:${aspects[index].name}`,
          rating: aspects[index].rating,
          findings: findings
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (aspectError) throw aspectError;

      const newAspects = [...aspects];
      newAspects[index] = { ...aspects[index], findings };
      setAspects(newAspects);
    } catch (error) {
      console.error("Error updating findings:", error);
      toast.error("Failed to update findings");
    }
  };

  const saveOverallRating = async () => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    try {
      const overallRating = calculateOverallRating(aspects);
      
      const { error } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Strategy",
          practice_name: "Business Alignment",
          rating: overallRating
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (error) throw error;

      toast.success("Overall rating saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving overall rating:", error);
      toast.error("Failed to save overall rating");
      return false;
    }
  };

  return {
    aspects,
    handleAspectClick,
    handleFindingsChange,
    saveOverallRating
  };
};