import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AspectCard } from "@/components/business-alignment/AspectCard";
import { calculateOverallRating } from "@/utils/businessAlignmentScoring";
import type { BusinessAlignmentAspect } from "@/types/business-alignment";
import { RatingLevel } from "@/types/ratings";
import { BusinessAlignmentHeader } from "@/components/business-alignment/BusinessAlignmentHeader";

const initialAspects: BusinessAlignmentAspect[] = [
  {
    name: "Business Objectives",
    description: "Clear definition of how AI aligns with overall business objectives.",
    rating: null
  },
  {
    name: "Value Proposition",
    description: "Demonstrated value provided by Generative AI solutions.",
    rating: null
  },
  {
    name: "ROI Measurement",
    description: "Metrics and methods for measuring ROI of AI initiatives.",
    rating: null
  },
  {
    name: "Alignment Meetings",
    description: "Regular alignment meetings between AI teams and business stakeholders.",
    rating: null
  },
  {
    name: "Use Case Identification",
    description: "Effective processes for identifying and prioritizing AI use cases.",
    rating: null
  },
  {
    name: "AI Roadmap",
    description: "A well-defined roadmap detailing AI implementation phases.",
    rating: null
  },
  {
    name: "Stakeholder Buy-in",
    description: "Level of support from key stakeholders across the organization.",
    rating: null
  }
];

export default function BusinessAlignmentAspects() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get("project");
  const assessmentDate = searchParams.get("date");
  const [aspects, setAspects] = useState<BusinessAlignmentAspect[]>(initialAspects);

  useEffect(() => {
    const loadRatings = async () => {
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
            if (aspectIndex !== -1 && rating.rating) {
              savedAspects[aspectIndex].rating = rating.rating as RatingLevel;
            }
          });
          setAspects(savedAspects);
        }
      } catch (error) {
        console.error("Error loading business alignment ratings:", error);
        toast.error("Failed to load ratings");
      }
    };

    loadRatings();
  }, [projectName, assessmentDate]);

  const handleAspectClick = (index: number) => {
    const ratings: RatingLevel[] = [
      "Largely in Place",
      "Somewhat in Place",
      "Not in Place"
    ];
    
    const currentRating = aspects[index].rating;
    const currentIndex = currentRating ? ratings.indexOf(currentRating) : -1;
    const nextRating = ratings[(currentIndex + 1) % ratings.length];
    
    const newAspects = [...aspects];
    newAspects[index] = { ...aspects[index], rating: nextRating };
    setAspects(newAspects);
  };

  const handleSave = async () => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    try {
      console.log("Saving business alignment ratings...");
      
      // Save individual aspect ratings
      for (const aspect of aspects) {
        const { error: aspectError } = await supabase
          .from("ratings")
          .upsert({
            project_name: projectName,
            assessment_date: assessmentDate,
            pillar_title: "Strategy",
            practice_name: `BusinessAlignment:${aspect.name}`,
            rating: aspect.rating
          }, {
            onConflict: 'project_name,assessment_date,pillar_title,practice_name'
          });

        if (aspectError) throw aspectError;
      }

      // Calculate and save the overall rating
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
      
      console.log("Successfully saved business alignment ratings");
      toast.success("Business alignment aspects saved successfully");
      navigate('/');
    } catch (error) {
      console.error("Error saving business alignment ratings:", error);
      toast.error("Failed to save ratings");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <BusinessAlignmentHeader onBackClick={() => navigate('/')} />

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