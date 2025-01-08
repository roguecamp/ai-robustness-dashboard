import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AspectGrid } from "@/components/shared/AspectGrid";
import { calculateOverallRating } from "@/utils/complianceRegulationScoring";
import { handleFindingsChange } from "@/utils/aspectHandlers";
import type { ComplianceRegulationAspect } from "@/types/compliance-regulation";
import { RatingKey } from "@/components/shared/RatingKey";

const initialAspects: ComplianceRegulationAspect[] = [
  {
    name: "Regulatory Awareness",
    description: "Staying updated on local and global AI regulations.",
    rating: null,
    findings: ""
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
    loadRatings();
  }, [projectName, assessmentDate]);

  const loadRatings = async () => {
    if (!projectName || !assessmentDate) return;

    try {
      const { data: ratings, error } = await supabase
        .from("ratings")
        .select("*")
        .eq("project_name", projectName)
        .eq("assessment_date", assessmentDate)
        .eq("pillar_title", "Legal")
        .like("practice_name", 'ComplianceRegulation:%');

      if (error) throw error;

      if (ratings && ratings.length > 0) {
        const savedAspects = [...aspects];
        ratings.forEach(rating => {
          const aspectName = rating.practice_name.replace("ComplianceRegulation:", "");
          const aspectIndex = savedAspects.findIndex(
            aspect => aspect.name === aspectName
          );
          if (aspectIndex !== -1) {
            savedAspects[aspectIndex].rating = rating.rating as ComplianceRegulationAspect["rating"];
            savedAspects[aspectIndex].findings = rating.findings || "";
          }
        });
        setAspects(savedAspects);
      }
    } catch (error) {
      console.error("Error loading ratings:", error);
      toast.error("Failed to load ratings");
    }
  };

  const handleAspectClick = async (index: number) => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    const ratings: ComplianceRegulationAspect["rating"][] = [
      "Largely in Place",
      "Somewhat in Place",
      "Not in Place"
    ];
    
    const currentRating = aspects[index].rating;
    const currentIndex = currentRating ? ratings.indexOf(currentRating) : -1;
    const nextRating = ratings[(currentIndex + 1) % ratings.length];

    try {
      const { error: aspectError } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Legal",
          practice_name: `ComplianceRegulation:${aspects[index].name}`,
          rating: nextRating,
          findings: aspects[index].findings
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (aspectError) throw aspectError;

      const newAspects = [...aspects];
      newAspects[index] = { ...aspects[index], rating: nextRating };
      setAspects(newAspects);
    } catch (error) {
      console.error("Error updating aspect rating:", error);
      toast.error("Failed to update rating");
    }
  };

  const onFindingsChange = async (index: number, findings: string) => {
    await handleFindingsChange(
      index,
      findings,
      projectName,
      assessmentDate,
      "Legal",
      `ComplianceRegulation:${aspects[index].name}`,
      aspects[index].rating
    );

    const newAspects = [...aspects];
    newAspects[index] = { ...aspects[index], findings };
    setAspects(newAspects);
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
          pillar_title: "Legal",
          practice_name: "Compliance and Regulation",
          rating: overallRating
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
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Compliance and Regulation Aspects</h1>
            <p className="text-gray-600">
              Rate each aspect of Compliance and Regulation by clicking on the cards. Click multiple times to cycle through ratings.
            </p>
          </div>
          <div className="flex gap-4 items-start">
            <RatingKey />
            <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
          </div>
        </div>

        <AspectGrid
          aspects={aspects}
          onAspectClick={handleAspectClick}
          onFindingsChange={onFindingsChange}
        />

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Overall Rating</Button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceRegulationAspects;
