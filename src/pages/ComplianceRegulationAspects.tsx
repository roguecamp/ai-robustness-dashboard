import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ComplianceRegulationAspect } from "@/types/compliance-regulation";
import { calculateOverallRating } from "@/utils/complianceRegulationScoring";
import { AspectCard } from "@/components/compliance-regulation/AspectCard";

const initialAspects: ComplianceRegulationAspect[] = [
  {
    name: "Regulatory Awareness",
    description: "Staying updated on local and global AI regulations.",
    rating: null
  },
  {
    name: "Compliance Monitoring",
    description: "Processes to ensure AI solutions are compliant with relevant regulations.",
    rating: null
  },
  {
    name: "Legal Support",
    description: "Access to legal support for AI compliance and regulation issues.",
    rating: null
  },
  {
    name: "Documentation",
    description: "Proper documentation for AI systems to demonstrate compliance.",
    rating: null
  },
  {
    name: "Regulatory Engagement",
    description: "Engaging with regulatory bodies and participating in industry groups.",
    rating: null
  },
  {
    name: "Audit Trails",
    description: "Maintaining audit trails for critical AI decisions and actions.",
    rating: null
  },
  {
    name: "Reporting Mechanisms",
    description: "Effective reporting mechanisms to report compliance status to stakeholders.",
    rating: null
  }
];

const ComplianceRegulationAspects = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get("project");
  const assessmentDate = searchParams.get("date");
  const [aspects, setAspects] = useState<ComplianceRegulationAspect[]>(initialAspects);

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
          .eq("practice_name", "Compliance and Regulation");

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          const savedAspects = [...aspects];
          ratings.forEach(rating => {
            const aspectIndex = savedAspects.findIndex(
              aspect => aspect.name === rating.aspect_name
            );
            if (aspectIndex !== -1) {
              savedAspects[aspectIndex].rating = rating.rating;
            }
          });
          setAspects(savedAspects);
        }
      } catch (error) {
        console.error("Error loading ratings:", error);
        toast.error("Failed to load ratings");
      }
    };

    loadRatings();
  }, [projectName, assessmentDate]);

  const handleAspectClick = (index: number) => {
    const newAspects = [...aspects];
    const currentRating = aspects[index].rating;
    const ratings: ("Largely in Place" | "Somewhat in Place" | "Not in Place")[] = [
      "Largely in Place",
      "Somewhat in Place",
      "Not in Place"
    ];
    const currentIndex = currentRating ? ratings.indexOf(currentRating) : -1;
    const nextRating = ratings[(currentIndex + 1) % ratings.length];
    newAspects[index] = { ...aspects[index], rating: nextRating };
    setAspects(newAspects);
  };

  const handleSaveOverallRating = async () => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    const overallRating = calculateOverallRating(aspects);
    if (!overallRating) {
      toast.error("Please rate at least one aspect");
      return;
    }

    try {
      const { error } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Legal",
          practice_name: "Compliance and Regulation",
          rating: overallRating
        });

      if (error) throw error;

      // Also save individual aspect ratings
      for (const aspect of aspects) {
        if (aspect.rating) {
          const { error: aspectError } = await supabase
            .from("ratings")
            .upsert({
              project_name: projectName,
              assessment_date: assessmentDate,
              pillar_title: "Legal",
              practice_name: "Compliance and Regulation",
              aspect_name: aspect.name,
              rating: aspect.rating
            });

          if (aspectError) throw aspectError;
        }
      }

      toast.success("Ratings saved successfully");
      navigate(`/?project=${projectName}&date=${assessmentDate}`);
    } catch (error) {
      console.error("Error saving ratings:", error);
      toast.error("Failed to save ratings");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Compliance and Regulation Aspects</h1>
          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate(`/?project=${projectName}&date=${assessmentDate}`)}
            >
              Back to Dashboard
            </Button>
            <Button onClick={handleSaveOverallRating}>
              Save Overall Rating
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

export default ComplianceRegulationAspects;