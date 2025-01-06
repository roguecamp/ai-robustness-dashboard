import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { IntellectualPropertyAspect } from "@/types/intellectual-property";
import { calculateOverallRating } from "@/utils/intellectualPropertyScoring";
import { AspectCard } from "@/components/business-alignment/AspectCard";

const IntellectualPropertyAspects = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get("project");
  const assessmentDate = searchParams.get("date");
  const [aspects, setAspects] = useState<IntellectualPropertyAspect[]>([
    {
      name: "IP Policies",
      description: "Clearly defined policies regarding AI-generated content and data.",
      rating: "Not in Place",
    },
    {
      name: "Contract Clarity",
      description: "Clear contracts regarding IP ownership with third-party vendors.",
      rating: "Not in Place",
    },
    {
      name: "IP Protection",
      description: "Mechanisms for protecting AI-generated IP.",
      rating: "Not in Place",
    },
    {
      name: "Licensing Agreements",
      description: "Proper licensing agreements for AI technologies and datasets.",
      rating: "Not in Place",
    },
    {
      name: "Legal Review",
      description: "Regular legal review of IP issues related to AI.",
      rating: "Not in Place",
    },
    {
      name: "IP Education",
      description: "Training on IP considerations for relevant stakeholders.",
      rating: "Not in Place",
    },
    {
      name: "IP Compliance",
      description: "Monitoring and ensuring compliance with IP policies and laws.",
      rating: "Not in Place",
    },
  ]);

  useEffect(() => {
    const loadRatings = async () => {
      if (!projectName || !assessmentDate) return;

      try {
        console.log("Loading IP aspect ratings for:", projectName, assessmentDate);
        const { data: ratings, error } = await supabase
          .from("ratings")
          .select("*")
          .eq("project_name", projectName)
          .eq("assessment_date", assessmentDate)
          .eq("pillar_title", "Legal")
          .eq("practice_name", "Intellectual Property");

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          console.log("Loaded IP aspect ratings:", ratings);
          const updatedAspects = aspects.map((aspect) => {
            const rating = ratings.find((r) => r.practice_name === aspect.name);
            return {
              ...aspect,
              rating: (rating?.rating as IntellectualPropertyAspect["rating"]) || aspect.rating,
            };
          });
          setAspects(updatedAspects);
        }
      } catch (error) {
        console.error("Error loading IP aspect ratings:", error);
        toast.error("Failed to load ratings");
      }
    };

    loadRatings();
  }, [projectName, assessmentDate]);

  const handleAspectClick = async (index: number) => {
    const newAspects = [...aspects];
    const currentRating = aspects[index].rating;
    const ratings: IntellectualPropertyAspect["rating"][] = [
      "Largely in Place",
      "Somewhat in Place",
      "Not in Place",
    ];
    const currentIndex = ratings.indexOf(currentRating);
    const nextIndex = (currentIndex + 1) % ratings.length;
    newAspects[index] = { ...aspects[index], rating: ratings[nextIndex] };
    setAspects(newAspects);

    if (!projectName || !assessmentDate) return;

    try {
      const { error } = await supabase.from("ratings").upsert({
        project_name: projectName,
        assessment_date: assessmentDate,
        pillar_title: "Legal",
        practice_name: aspects[index].name,
        rating: ratings[nextIndex],
      });

      if (error) throw error;

      const overallRating = calculateOverallRating(newAspects);
      await supabase.from("ratings").upsert({
        project_name: projectName,
        assessment_date: assessmentDate,
        pillar_title: "Legal",
        practice_name: "Intellectual Property",
        rating: overallRating,
      });

    } catch (error) {
      console.error("Error saving rating:", error);
      toast.error("Failed to save rating");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Intellectual Property Aspects</h1>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
          >
            Back to Dashboard
          </Button>
        </div>

        <div className="grid gap-6">
          {aspects.map((aspect, index) => (
            <AspectCard
              key={aspect.name}
              aspect={aspect}
              onClick={() => handleAspectClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntellectualPropertyAspects;