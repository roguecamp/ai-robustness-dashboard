import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { InfrastructureAspect } from "@/types/infrastructure";
import { calculateOverallRating } from "@/utils/infrastructureScoring";
import { AspectCard } from "@/components/business-alignment/AspectCard";
import type { RatingLevel } from "@/types/ratings";

const InfrastructureAspects = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get("project");
  const assessmentDate = searchParams.get("date");
  const [aspects, setAspects] = useState<InfrastructureAspect[]>([
    {
      name: "Scalable Infrastructure",
      description: "Infrastructure that can scale with growing AI needs.",
      rating: "Not in Place",
    },
    {
      name: "Performance Monitoring",
      description: "Tools and processes to monitor infrastructure performance.",
      rating: "Not in Place",
    },
    {
      name: "Resource Allocation",
      description: "Adequate allocation of resources (e.g., computing, storage).",
      rating: "Not in Place",
    },
    {
      name: "Cost Management",
      description: "Monitoring and managing infrastructure costs.",
      rating: "Not in Place",
    },
    {
      name: "Cloud Adoption",
      description: "Leveraging cloud resources for better scalability and performance.",
      rating: "Not in Place",
    },
    {
      name: "Security Measures",
      description: "Security measures to protect infrastructure.",
      rating: "Not in Place",
    },
    {
      name: "Disaster Recovery",
      description: "Effective disaster recovery and backup solutions.",
      rating: "Not in Place",
    },
  ]);

  useEffect(() => {
    const loadRatings = async () => {
      if (!projectName || !assessmentDate) return;

      try {
        console.log("Loading infrastructure aspect ratings for:", projectName, assessmentDate);
        const { data: ratings, error } = await supabase
          .from("ratings")
          .select("*")
          .eq("project_name", projectName)
          .eq("assessment_date", assessmentDate)
          .eq("pillar_title", "Solution")
          .like("practice_name", 'Infrastructure:%');

        if (error) throw error;

        console.log("Loaded infrastructure aspect ratings:", ratings);

        if (ratings && ratings.length > 0) {
          const savedAspects = [...aspects];
          ratings.forEach(rating => {
            const aspectName = rating.practice_name.replace("Infrastructure:", "");
            const aspectIndex = savedAspects.findIndex(
              aspect => aspect.name === aspectName
            );
            if (aspectIndex !== -1) {
              savedAspects[aspectIndex].rating = rating.rating as RatingLevel;
            }
          });
          setAspects(savedAspects);
        }
      } catch (error) {
        console.error("Error loading infrastructure aspect ratings:", error);
        toast.error("Failed to load ratings");
      }
    };

    loadRatings();
  }, [projectName, assessmentDate]);

  const handleAspectClick = async (index: number) => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    const ratings: RatingLevel[] = [
      "Largely in Place",
      "Somewhat in Place",
      "Not in Place",
    ];
    const currentRating = aspects[index].rating;
    const currentIndex = ratings.indexOf(currentRating);
    const nextRating = ratings[(currentIndex + 1) % ratings.length];

    try {
      // Save the individual aspect rating
      const { error: aspectError } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Solution",
          practice_name: `Infrastructure:${aspects[index].name}`,
          rating: nextRating
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (aspectError) throw aspectError;

      // Update local state
      const newAspects = [...aspects];
      newAspects[index] = { ...aspects[index], rating: nextRating };
      setAspects(newAspects);

      console.log(`Updated aspect ${aspects[index].name} to ${nextRating}`);
    } catch (error) {
      console.error("Error updating aspect rating:", error);
      toast.error("Failed to update rating");
    }
  };

  const handleSave = async () => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    try {
      const overallRating = calculateOverallRating(aspects);
      
      // Update the overall rating
      const { error } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Solution",
          practice_name: "Infrastructure",
          rating: overallRating,
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (error) throw error;

      toast.success("Overall rating saved successfully");
      navigate(`/?project=${projectName}&date=${assessmentDate}`);
    } catch (error) {
      console.error("Error saving overall rating:", error);
      toast.error("Failed to save overall rating");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Infrastructure Aspects</h1>
            <p className="text-gray-500">Evaluate each aspect to determine overall rating</p>
          </div>
          <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
        </div>

        <div className="grid gap-4">
          {aspects.map((aspect, index) => (
            <AspectCard
              key={aspect.name}
              aspect={aspect}
              onClick={() => handleAspectClick(index)}
            />
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Overall Rating</Button>
        </div>
      </div>
    </div>
  );
};

export default InfrastructureAspects;