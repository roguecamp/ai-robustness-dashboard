import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AspectCard } from "@/components/business-alignment/AspectCard";
import type { InfrastructureAspect } from "@/types/infrastructure";
import type { RatingLevel } from "@/types/ratings";
import { calculateOverallRating } from "@/utils/infrastructureScoring";

const initialAspects: InfrastructureAspect[] = [
  {
    name: "Scalable Infrastructure",
    description: "Infrastructure that can scale with growing AI needs.",
    rating: null,
    findings: ""
  },
  {
    name: "Performance Monitoring",
    description: "Tools and processes to monitor infrastructure performance.",
    rating: null,
    findings: ""
  },
  {
    name: "Resource Allocation",
    description: "Adequate allocation of resources (e.g., computing, storage).",
    rating: null,
    findings: ""
  },
  {
    name: "Cost Management",
    description: "Monitoring and managing infrastructure costs.",
    rating: null,
    findings: ""
  },
  {
    name: "Cloud Adoption",
    description: "Leveraging cloud resources for better scalability and performance.",
    rating: null,
    findings: ""
  },
  {
    name: "Security Measures",
    description: "Security measures to protect infrastructure.",
    rating: null,
    findings: ""
  },
  {
    name: "Disaster Recovery",
    description: "Effective disaster recovery and backup solutions.",
    rating: null,
    findings: ""
  },
];

const InfrastructureAspects = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get("project");
  const assessmentDate = searchParams.get("date");
  const [aspects, setAspects] = useState<InfrastructureAspect[]>(initialAspects);

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
              savedAspects[aspectIndex].rating = rating.rating as InfrastructureAspect["rating"];
              savedAspects[aspectIndex].findings = rating.findings || "";
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
      "Not in Place"
    ];
    
    const currentRating = aspects[index].rating;
    const currentIndex = ratings.indexOf(currentRating);
    const nextRating = ratings[(currentIndex + 1) % ratings.length];
    
    try {
      const { error: aspectError } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Solution",
          practice_name: `Infrastructure:${aspects[index].name}`,
          rating: nextRating,
          findings: aspects[index].findings
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (aspectError) throw aspectError;

      const newAspects = [...aspects];
      newAspects[index] = { ...aspects[index], rating: nextRating };
      setAspects(newAspects);

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
          pillar_title: "Solution",
          practice_name: `Infrastructure:${aspects[index].name}`,
          rating: aspects[index].rating,
          findings: findings
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (aspectError) throw aspectError;

      const newAspects = [...aspects];
      newAspects[index] = { ...aspects[index], findings };
      setAspects(newAspects);
    } catch (error) {
      console.error("Error updating findings:", error);
      toast.error("Failed to update findings");
    }
  };

  const handleSave = async () => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    try {
      const overallRating = calculateOverallRating(aspects);
      
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
              onFindingsChange={(findings) => handleFindingsChange(index, findings)}
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
