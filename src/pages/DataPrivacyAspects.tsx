import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AspectCard } from "@/components/data-privacy/AspectCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { DataPrivacyAspect } from "@/types/data-privacy";
import { calculateOverallRating } from "@/utils/dataPrivacyScoring";

const initialAspects: DataPrivacyAspect[] = [
  {
    name: "Privacy Policies",
    description: "Established and communicated data privacy policies.",
    rating: null,
  },
  {
    name: "Privacy Measures",
    description: "Categorize levels of data privacy.",
    rating: null,
  },
  {
    name: "Compliance with Laws",
    description: "Compliance with data protection laws and regulations (e.g., GDPR, CCPA).",
    rating: null,
  },
  {
    name: "Data Encryption",
    description: "Encryption of sensitive data both in transit and at rest.",
    rating: null,
  },
  {
    name: "Access Controls",
    description: "Role-based access controls to restrict data access.",
    rating: null,
  },
  {
    name: "Privacy Auditing",
    description: "Test for or scan potential privacy issues in your data.",
    rating: null,
  },
  {
    name: "Incident Response",
    description: "Effective incident response plans for data breaches compromising privacy.",
    rating: null,
  },
];

const isValidRating = (rating: string | null): rating is "Largely in Place" | "Somewhat in Place" | "Not in Place" => {
  return rating === "Largely in Place" || 
         rating === "Somewhat in Place" || 
         rating === "Not in Place";
};

export default function DataPrivacyAspects() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [aspects, setAspects] = useState<DataPrivacyAspect[]>(initialAspects);
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
          .eq("pillar_title", "Data")
          .eq("practice_name", "Data Privacy");

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          const updatedAspects = aspects.map(aspect => {
            const rating = ratings.find(r => r.practice_name === aspect.name);
            return {
              ...aspect,
              rating: isValidRating(rating?.rating) ? rating.rating : null,
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
        .eq("pillar_title", "Data")
        .eq("practice_name", "Data Privacy");

      // Insert new ratings
      const ratingsToInsert = aspects.map(aspect => ({
        project_name: projectName,
        assessment_date: assessmentDate,
        pillar_title: "Data",
        practice_name: aspect.name,
        rating: aspect.rating,
      }));

      const { error } = await supabase.from("ratings").insert(ratingsToInsert);

      if (error) throw error;

      const overallRating = calculateOverallRating(aspects);
      
      // Update the overall rating for Data Privacy
      const { error: updateError } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Data",
          practice_name: "Data Privacy",
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
            <h1 className="text-2xl font-bold mb-2">Data Privacy Aspects</h1>
            <p className="text-gray-600">
              Rate each aspect of Data Privacy by clicking on the cards. Click multiple times to cycle through ratings.
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
          <Button onClick={handleSave}>Save Ratings</Button>
        </div>
      </div>
    </div>
  );
}