import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { InfrastructureAspect } from "@/types/infrastructure";
import { calculateOverallRating } from "@/utils/infrastructureScoring";
import { AspectCard } from "@/components/business-alignment/AspectCard";

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
          .eq("practice_name", "Infrastructure");

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          console.log("Loaded infrastructure aspect ratings:", ratings);
          const updatedAspects = aspects.map((aspect) => {
            const rating = ratings.find((r) => r.practice_name === aspect.name);
            return {
              ...aspect,
              rating: (rating?.rating as InfrastructureAspect["rating"]) || aspect.rating,
            };
          });
          setAspects(updatedAspects);
        }
      } catch (error) {
        console.error("Error loading infrastructure aspect ratings:", error);
        toast.error("Failed to load ratings");
      }
    };

    loadRatings();
  }, [projectName, assessmentDate]);

  const handleAspectClick = async (index: number) => {
    const newAspects = [...aspects];
    const currentRating = aspects[index].rating;
    const ratings: InfrastructureAspect["rating"][] = [
      "Largely in Place",
      "Somewhat in Place",
      "Not in Place",
    ];
    const currentIndex = ratings.indexOf(currentRating);
    const nextIndex = (currentIndex + 1) % ratings.length;
    newAspects[index] = { ...aspects[index], rating: ratings[nextIndex] };
    setAspects(newAspects);
  };

  const handleSave = async () => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    try {
      // Delete existing ratings
      await supabase
        .from("ratings")
        .delete()
        .eq("project_name", projectName)
        .eq("assessment_date", assessmentDate)
        .eq("pillar_title", "Solution")
        .eq("practice_name", "Infrastructure");

      // Insert new ratings
      const ratingsToInsert = aspects.map(aspect => ({
        project_name: projectName,
        assessment_date: assessmentDate,
        pillar_title: "Solution",
        practice_name: aspect.name,
        rating: aspect.rating,
      }));

      const { error } = await supabase.from("ratings").insert(ratingsToInsert);

      if (error) throw error;

      const overallRating = calculateOverallRating(aspects);
      
      // Update the overall rating
      const { error: updateError } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Solution",
          practice_name: "Infrastructure",
          rating: overallRating,
        });

      if (updateError) throw updateError;

      toast.success("Ratings saved successfully");
      navigate('/');
    } catch (error) {
      console.error("Error saving ratings:", error);
      toast.error("Failed to save ratings");
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