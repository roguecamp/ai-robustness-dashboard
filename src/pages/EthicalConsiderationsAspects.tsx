import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AspectCard } from "@/components/ethical-considerations/AspectCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { EthicalConsiderationsAspect } from "@/types/ethical-considerations";
import { calculateOverallRating } from "@/utils/ethicalConsiderationsScoring";

const initialAspects: EthicalConsiderationsAspect[] = [
  {
    name: "Ethics Guidelines",
    description: "Defined and communicated AI ethics guidelines.",
    rating: null,
  },
  {
    name: "Ethics Board",
    description: "An established board to review and approve AI projects for ethical considerations.",
    rating: null,
  },
  {
    name: "Ethical Training",
    description: "Training on AI ethics for relevant stakeholders.",
    rating: null,
  },
  {
    name: "Ethical Audits",
    description: "Regular audits to ensure AI solutions adhere to ethical guidelines.",
    rating: null,
  },
  {
    name: "Bias Mitigation",
    description: "Processes to identify and mitigate unintentional biases in AI systems.",
    rating: null,
  },
  {
    name: "Transparency",
    description: "Transparency to stakeholders on how AI systems operate and make decisions.",
    rating: null,
  },
  {
    name: "Public Engagement",
    description: "Engagement with the public or external experts on AI ethics.",
    rating: null,
  },
];

export default function EthicalConsiderationsAspects() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [aspects, setAspects] = useState<EthicalConsiderationsAspect[]>(initialAspects);
  const projectName = searchParams.get("project");
  const assessmentDate = searchParams.get("date");

  useEffect(() => {
    const loadRatings = async () => {
      if (!projectName || !assessmentDate) return;

      try {
        const { data: ratings, error } = await supabase
          .from("ratings")
          .select("*")
          .eq("project_name", projectName)
          .eq("assessment_date", assessmentDate)
          .eq("pillar_title", "Legal")
          .eq("practice_name", "Ethical Considerations");

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          const updatedAspects = aspects.map(aspect => {
            const rating = ratings.find(r => r.practice_name === aspect.name);
            return {
              ...aspect,
              rating: rating?.rating as EthicalConsiderationsAspect["rating"] || null,
            };
          });
          setAspects(updatedAspects);
        }
      } catch (error) {
        console.error("Error loading ratings:", error);
        toast.error("Failed to load ratings");
      }
    };

    loadRatings();
  }, [projectName, assessmentDate]);

  const handleAspectClick = (index: number) => {
    const ratings: ("Largely in Place" | "Somewhat in Place" | "Not in Place")[] = [
      "Largely in Place",
      "Somewhat in Place",
      "Not in Place",
    ];
    
    const currentRating = aspects[index].rating;
    const currentIndex = currentRating ? ratings.indexOf(currentRating) : -1;
    const nextIndex = (currentIndex + 1) % ratings.length;

    const updatedAspects = [...aspects];
    updatedAspects[index] = {
      ...aspects[index],
      rating: ratings[nextIndex],
    };
    setAspects(updatedAspects);
  };

  const handleSave = async () => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    try {
      // Delete existing ratings for this practice
      await supabase
        .from("ratings")
        .delete()
        .eq("project_name", projectName)
        .eq("assessment_date", assessmentDate)
        .eq("pillar_title", "Legal")
        .eq("practice_name", "Ethical Considerations");

      // Insert new ratings
      const ratingsToInsert = aspects.map(aspect => ({
        project_name: projectName,
        assessment_date: assessmentDate,
        pillar_title: "Legal",
        practice_name: aspect.name,
        rating: aspect.rating,
      }));

      const { error } = await supabase.from("ratings").insert(ratingsToInsert);

      if (error) throw error;

      const overallRating = calculateOverallRating(aspects);
      
      // Update the overall rating for Ethical Considerations
      const { error: updateError } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Legal",
          practice_name: "Ethical Considerations",
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
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Ethical Considerations Aspects</h1>
            <p className="text-gray-600">
              Rate each aspect of Ethical Considerations by clicking on the cards. Click multiple times to cycle through ratings.
            </p>
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
}