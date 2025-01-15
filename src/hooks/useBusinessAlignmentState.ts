import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { BusinessAlignmentAspect } from "@/types/business-alignment";
import type { RatingLevel } from "@/types/ratings";
import { useDashboardStore } from "@/components/dashboard/DashboardState";

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
  const { setPillarRatings } = useDashboardStore();

  useEffect(() => {
    loadAspects();
  }, [projectName, assessmentDate]);

  const loadAspects = async () => {
    if (!projectName || !assessmentDate) {
      console.log("Missing project name or assessment date, using initial aspects");
      setAspects(initialAspects);
      return;
    }

    try {
      console.log("Loading business alignment ratings for:", projectName, assessmentDate);
      const { data: ratings, error } = await supabase
        .from("ratings")
        .select("*")
        .eq("project_name", projectName)
        .eq("assessment_date", assessmentDate)
        .eq("pillar_title", "Strategy")
        .or(`practice_name.like.Business:*,practice_name.eq.Business Alignment`);

      if (error) throw error;

      console.log("Loaded ratings:", ratings);

      if (ratings && ratings.length > 0) {
        const savedAspects = [...initialAspects];
        ratings.forEach(rating => {
          const practiceName = rating.practice_name.replace('Business:', '');
          console.log("Processing rating:", rating.practice_name, "Practice name:", practiceName);
          
          const aspectIndex = savedAspects.findIndex(
            aspect => aspect.name === practiceName
          );

          if (aspectIndex !== -1 && rating.rating) {
            console.log(`Found matching aspect for ${practiceName}:`, savedAspects[aspectIndex].name);
            savedAspects[aspectIndex] = {
              ...savedAspects[aspectIndex],
              rating: rating.rating as RatingLevel,
              findings: rating.findings || ""
            };
          }
        });
        console.log("Setting aspects to:", savedAspects);
        setAspects(savedAspects);
      } else {
        console.log("No ratings found, using initial aspects");
        setAspects(initialAspects);
      }
    } catch (error) {
      console.error("Error loading ratings:", error);
      toast.error("Failed to load ratings");
      setAspects(initialAspects);
    }
  };

  const updateDashboardState = async () => {
    if (!projectName || !assessmentDate) return;

    try {
      const { data: ratings, error } = await supabase
        .from("ratings")
        .select("*")
        .eq("project_name", projectName)
        .eq("assessment_date", assessmentDate);

      if (error) throw error;

      if (ratings) {
        const pillarRatings: Record<string, any[]> = {};
        ratings.forEach(rating => {
          if (!pillarRatings[rating.pillar_title]) {
            pillarRatings[rating.pillar_title] = [];
          }
          pillarRatings[rating.pillar_title].push({
            name: rating.practice_name,
            rating: rating.rating,
            findings: rating.findings
          });
        });
        setPillarRatings(pillarRatings);
      }
    } catch (error) {
      console.error("Error updating dashboard state:", error);
    }
  };

  const handleAspectClick = async (index: number) => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    const ratings: RatingLevel[] = [
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
          practice_name: `Business:${aspects[index].name}`,
          rating: nextRating,
          findings: aspects[index].findings
        });

      if (aspectError) throw aspectError;

      const newAspects = [...aspects];
      newAspects[index] = { ...aspects[index], rating: nextRating };
      setAspects(newAspects);
      await updateDashboardState();
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
          practice_name: `Business:${aspects[index].name}`,
          rating: aspects[index].rating,
          findings: findings
        });

      if (aspectError) throw aspectError;

      const newAspects = [...aspects];
      newAspects[index] = { ...aspects[index], findings };
      setAspects(newAspects);
      await updateDashboardState();
    } catch (error) {
      console.error("Error updating findings:", error);
      toast.error("Failed to update findings");
    }
  };

  const saveOverallRating = async () => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return false;
    }

    try {
      const { error } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Strategy",
          practice_name: "Business Alignment",
          rating: calculateOverallRating()
        });

      if (error) throw error;

      await updateDashboardState();
      toast.success("Overall rating saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving overall rating:", error);
      toast.error("Failed to save overall rating");
      return false;
    }
  };

  const calculateOverallRating = () => {
    const ratingScores = {
      "Largely in Place": 2,
      "Somewhat in Place": 1,
      "Not in Place": 0
    };

    const totalScore = aspects.reduce((sum, aspect) => {
      return sum + (aspect.rating ? ratingScores[aspect.rating] : 0);
    }, 0);

    const maxScore = aspects.length * 2;
    const percentage = (totalScore / maxScore) * 100;

    if (percentage >= 70) return "Largely in Place";
    if (percentage >= 30) return "Somewhat in Place";
    return "Not in Place";
  };

  return {
    aspects,
    handleAspectClick,
    handleFindingsChange,
    saveOverallRating
  };
};