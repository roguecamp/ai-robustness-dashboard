import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DataGovernanceAspect } from "@/types/data-governance";
import { calculateOverallRating } from "@/utils/dataGovernanceScoring";
import { AspectCard } from "@/components/data-governance/AspectCard";
import { RatingKey } from "@/components/shared/RatingKey";

const initialAspects: DataGovernanceAspect[] = [
  {
    name: "Governance Framework",
    description: "Established data governance framework with clear policies and procedures.",
    rating: null
  },
  {
    name: "Data Ownership",
    description: "Defined data ownership and stewardship roles.",
    rating: null
  },
  {
    name: "Metadata Management",
    description: "Effective metadata management for data discoverability and understanding.",
    rating: null
  },
  {
    name: "Data Quality Management",
    description: "Processes to ensure and enhance data quality.",
    rating: null
  },
  {
    name: "Data Lifecycle Management",
    description: "Managing data throughout its lifecycle from collection to deletion.",
    rating: null
  },
  {
    name: "Data Governance Tools",
    description: "Tools to enforce data governance policies.",
    rating: null
  },
  {
    name: "Compliance Monitoring",
    description: "Monitoring and ensuring compliance with data governance policies.",
    rating: null
  }
];

export default function DataGovernanceAspects() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get("project");
  const assessmentDate = searchParams.get("date");
  const [aspects, setAspects] = useState<DataGovernanceAspect[]>(initialAspects);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAspectRatings = async () => {
      if (!projectName || !assessmentDate) {
        setIsLoading(false);
        return;
      }

      try {
        console.log("Loading data governance ratings for:", projectName, assessmentDate);
        const { data: ratings, error } = await supabase
          .from("ratings")
          .select("practice_name, rating")
          .eq("project_name", projectName)
          .eq("assessment_date", assessmentDate)
          .eq("pillar_title", "Data")
          .like("practice_name", "DataGovernance:%");

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          console.log("Loaded data governance ratings:", ratings);
          const updatedAspects = aspects.map(aspect => {
            const matchingRating = ratings.find(r => r.practice_name === `DataGovernance:${aspect.name}`);
            return {
              ...aspect,
              rating: matchingRating?.rating as DataGovernanceAspect["rating"] || null
            };
          });
          setAspects(updatedAspects);
        }
      } catch (error) {
        console.error("Error loading ratings:", error);
        toast.error("Failed to load aspect ratings");
      } finally {
        setIsLoading(false);
      }
    };

    loadAspectRatings();
  }, [projectName, assessmentDate]);

  const handleAspectClick = (index: number) => {
    const ratings: DataGovernanceAspect["rating"][] = [
      "Largely in Place",
      "Somewhat in Place",
      "Not in Place"
    ];
    
    const updatedAspects = [...aspects];
    const currentRating = aspects[index].rating;
    const currentIndex = currentRating ? ratings.indexOf(currentRating) : -1;
    const nextIndex = (currentIndex + 1) % ratings.length;
    
    updatedAspects[index] = {
      ...aspects[index],
      rating: ratings[nextIndex]
    };
    
    setAspects(updatedAspects);
  };

  const handleSave = async () => {
    if (!projectName || !assessmentDate) {
      toast.error("Missing project information");
      return;
    }

    try {
      console.log("Saving data governance ratings...");
      
      // Save individual aspect ratings
      for (const aspect of aspects) {
        const { error: aspectError } = await supabase
          .from("ratings")
          .upsert({
            project_name: projectName,
            assessment_date: assessmentDate,
            pillar_title: "Data",
            practice_name: `DataGovernance:${aspect.name}`,
            rating: aspect.rating
          }, {
            onConflict: "project_name,assessment_date,pillar_title,practice_name"
          });

        if (aspectError) {
          console.error(`Error saving aspect ${aspect.name}:`, aspectError);
          throw aspectError;
        }
      }

      // Calculate and save the overall rating
      const overallRating = calculateOverallRating(aspects);
      console.log("Saving overall rating:", overallRating);
      
      const { error } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Data",
          practice_name: "Data Governance",
          rating: overallRating
        }, {
          onConflict: "project_name,assessment_date,pillar_title,practice_name"
        });

      if (error) {
        console.error("Error saving overall rating:", error);
        throw error;
      }
      
      toast.success("Data governance aspects saved successfully");
      navigate("/");
    } catch (error) {
      console.error("Error saving ratings:", error);
      toast.error("Failed to save ratings");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading data governance aspects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Data Governance Aspects</h1>
            <p className="text-gray-600">
              Rate each aspect of Data Governance by clicking on the cards. Click multiple times to cycle through ratings.
            </p>
          </div>
          <div className="flex gap-4 items-start">
            <RatingKey />
            <Button onClick={() => navigate("/")}>Back to Dashboard</Button>
          </div>
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