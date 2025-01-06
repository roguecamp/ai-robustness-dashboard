import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AspectCard } from "@/components/data-governance/AspectCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { DataGovernanceAspect } from "@/types/data-governance";
import { calculateOverallRating } from "@/utils/dataGovernanceScoring";

const initialAspects: DataGovernanceAspect[] = [
  {
    name: "Governance Framework",
    description: "Established data governance framework with clear policies and procedures.",
    rating: null,
  },
  {
    name: "Data Ownership",
    description: "Defined data ownership and stewardship roles.",
    rating: null,
  },
  {
    name: "Metadata Management",
    description: "Effective metadata management for data discoverability and understanding.",
    rating: null,
  },
  {
    name: "Data Quality Management",
    description: "Processes to ensure and enhance data quality.",
    rating: null,
  },
  {
    name: "Data Lifecycle Management",
    description: "Managing data throughout its lifecycle from collection to deletion.",
    rating: null,
  },
  {
    name: "Data Governance Tools",
    description: "Tools to enforce data governance policies.",
    rating: null,
  },
  {
    name: "Compliance Monitoring",
    description: "Monitoring and ensuring compliance with data governance policies.",
    rating: null,
  },
];

const isValidRating = (rating: string | null): rating is "Largely in Place" | "Somewhat in Place" | "Not in Place" => {
  return rating === "Largely in Place" || 
         rating === "Somewhat in Place" || 
         rating === "Not in Place";
};

export default function DataGovernanceAspects() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [aspects, setAspects] = useState<DataGovernanceAspect[]>(initialAspects);
  const projectName = searchParams.get("project");
  const assessmentDate = searchParams.get("date");

  useEffect(() => {
    const loadRatings = async () => {
      if (!projectName || !assessmentDate) return;

      try {
        console.log("Loading ratings for:", projectName, assessmentDate);
        const { data: ratings, error } = await supabase
          .from("ratings")
          .select("*")
          .eq("project_name", projectName)
          .eq("assessment_date", assessmentDate)
          .eq("pillar_title", "Data")
          .eq("practice_name", "Data Governance");

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          console.log("Loaded ratings:", ratings);
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
      console.log("Saving ratings for aspects:", aspects);
      
      // Prepare the ratings for upsert
      const ratingsToUpsert = aspects.map(aspect => ({
        project_name: projectName,
        assessment_date: assessmentDate,
        pillar_title: "Data",
        practice_name: aspect.name,
        rating: aspect.rating
      }));

      // Use upsert instead of insert
      const { error: aspectsError } = await supabase
        .from("ratings")
        .upsert(ratingsToUpsert, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name',
          ignoreDuplicates: false
        });

      if (aspectsError) throw aspectsError;

      // Calculate and save the overall rating
      const overallRating = calculateOverallRating(aspects);
      console.log("Saving overall rating:", overallRating);
      
      const { error: overallError } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Data",
          practice_name: "Data Governance",
          rating: overallRating
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name',
          ignoreDuplicates: false
        });

      if (overallError) throw overallError;
      
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
            <h1 className="text-2xl font-bold mb-2">Data Governance Aspects</h1>
            <p className="text-gray-600">
              Rate each aspect of Data Governance by clicking on the cards. Click multiple times to cycle through ratings.
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