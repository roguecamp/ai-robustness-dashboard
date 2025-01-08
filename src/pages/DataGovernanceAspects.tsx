import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DataGovernanceGrid } from "@/components/data-governance/DataGovernanceGrid";
import type { DataGovernanceAspect } from "@/types/data-governance";
import { calculateOverallRating } from "@/utils/dataGovernanceScoring";

const initialAspects: DataGovernanceAspect[] = [
  {
    name: "Data Quality",
    description: "Processes for ensuring data quality and accuracy",
    rating: null,
    findings: ""
  },
  {
    name: "Data Security",
    description: "Measures to protect data from unauthorized access",
    rating: null,
    findings: ""
  },
  {
    name: "Data Privacy",
    description: "Compliance with data privacy regulations",
    rating: null,
    findings: ""
  },
  {
    name: "Data Governance Framework",
    description: "Established framework for data governance",
    rating: null,
    findings: ""
  },
  {
    name: "Data Lifecycle Management",
    description: "Processes for managing data throughout its lifecycle",
    rating: null,
    findings: ""
  },
  {
    name: "Data Stewardship",
    description: "Roles and responsibilities for data stewardship",
    rating: null,
    findings: ""
  },
  {
    name: "Data Access Controls",
    description: "Controls to manage access to data",
    rating: null,
    findings: ""
  }
];

export default function DataGovernanceAspects() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get("project");
  const assessmentDate = searchParams.get("date");
  const [aspects, setAspects] = useState<DataGovernanceAspect[]>(initialAspects);

  useEffect(() => {
    loadAspects();
  }, [projectName, assessmentDate]);

  const loadAspects = async () => {
    if (!projectName || !assessmentDate) return;

    try {
      const { data: ratings, error } = await supabase
        .from("ratings")
        .select("*")
        .eq("project_name", projectName)
        .eq("assessment_date", assessmentDate)
        .eq("pillar_title", "Data")
        .like("practice_name", "DataGovernance:%");

      if (error) throw error;

      if (ratings && ratings.length > 0) {
        const updatedAspects = aspects.map(aspect => {
          const rating = ratings.find(r => r.practice_name === `DataGovernance:${aspect.name}`);
          return {
            ...aspect,
            rating: rating?.rating as DataGovernanceAspect["rating"] || null,
            findings: rating?.findings || ""
          };
        });
        setAspects(updatedAspects);
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

    const ratings: DataGovernanceAspect["rating"][] = [
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
          pillar_title: "Data",
          practice_name: `DataGovernance:${aspects[index].name}`,
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
      const { error } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Data",
          practice_name: `DataGovernance:${aspects[index].name}`,
          rating: aspects[index].rating,
          findings: findings
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (error) throw error;

      const newAspects = [...aspects];
      newAspects[index] = { ...aspects[index], findings };
      setAspects(newAspects);
    } catch (error) {
      console.error("Error updating findings:", error);
      toast.error("Failed to update findings");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Data Governance Aspects</h1>
            <p className="text-gray-600">Evaluate each aspect of data governance</p>
          </div>
          <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
        </div>

        <DataGovernanceGrid
          aspects={aspects}
          onAspectClick={handleAspectClick}
          onFindingsChange={handleFindingsChange}
        />

        <div className="flex justify-end">
          <Button onClick={() => navigate('/')}>Save Overall Rating</Button>
        </div>
      </div>
    </div>
  );
}
