import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AspectCard } from "@/components/data-acquisition/AspectCard";
import { calculateOverallRating } from "@/utils/dataAcquisitionScoring";
import type { DataAcquisitionAspect } from "@/types/data-acquisition";

const dataAcquisitionAspects: DataAcquisitionAspect[] = [
  {
    name: "Data Collection",
    description: "Data Needed is sourced and available",
    rating: null,
    findings: ""
  },
  {
    name: "Data Quality Metrics",
    description: "Confirm the Data trustworthy to use",
    rating: null,
    findings: ""
  },
  {
    name: "Data Validation",
    description: "Processes for validating and cleaning data.",
    rating: null,
    findings: ""
  },
  {
    name: "Data Annotation",
    description: "Tools and processes for annotating data, if necessary.",
    rating: null,
    findings: ""
  },
  {
    name: "Data Updates and Relevance",
    description: "Regular updates to ensure data relevance to solutions.",
    rating: null,
    findings: ""
  },
  {
    name: "Data Structure",
    description: "Structured and labeling requirements or use of unstructured data",
    rating: null,
    findings: ""
  },
  {
    name: "Source Diversity",
    description: "Variety in data sources to ensure comprehensive data collection.",
    rating: null,
    findings: ""
  }
];

const DataAcquisitionAspects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectName = queryParams.get('project');
  const assessmentDate = queryParams.get('date');
  
  const [aspects, setAspects] = useState<DataAcquisitionAspect[]>(dataAcquisitionAspects);

  useEffect(() => {
    const loadAspectRatings = async () => {
      if (!projectName || !assessmentDate) return;

      try {
        const { data: ratings, error } = await supabase
          .from('ratings')
          .select('practice_name, rating, findings')
          .eq('project_name', projectName)
          .eq('assessment_date', assessmentDate)
          .eq('pillar_title', 'Data')
          .like('practice_name', 'Data Acquisition:%');

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          const updatedAspects = aspects.map(aspect => {
            const matchingRating = ratings.find(r => r.practice_name === `Data Acquisition:${aspect.name}`);
            return {
              ...aspect,
              rating: matchingRating?.rating as DataAcquisitionAspect["rating"] || null,
              findings: matchingRating?.findings || ""
            };
          });
          setAspects(updatedAspects);
        }
      } catch (error) {
        console.error("Error loading ratings:", error);
        toast.error("Failed to load aspect ratings");
      }
    };

    loadAspectRatings();
  }, [projectName, assessmentDate]);

  const handleAspectClick = async (index: number) => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    const ratings: DataAcquisitionAspect["rating"][] = [
      "Largely in Place",
      "Somewhat in Place",
      "Not in Place"
    ];
    
    const currentRating = aspects[index].rating;
    const currentIndex = currentRating ? ratings.indexOf(currentRating) : -1;
    const nextRating = ratings[(currentIndex + 1) % ratings.length];
    
    try {
      const { error: aspectError } = await supabase
        .from('ratings')
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: 'Data',
          practice_name: `Data Acquisition:${aspects[index].name}`,
          rating: nextRating,
          findings: aspects[index].findings
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (aspectError) throw aspectError;

      const updatedAspects = [...aspects];
      updatedAspects[index] = { ...aspects[index], rating: nextRating };
      setAspects(updatedAspects);
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
        .from('ratings')
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: 'Data',
          practice_name: `Data Acquisition:${aspects[index].name}`,
          rating: aspects[index].rating,
          findings: findings
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (aspectError) throw aspectError;

      const updatedAspects = [...aspects];
      updatedAspects[index] = { ...aspects[index], findings };
      setAspects(updatedAspects);
    } catch (error) {
      console.error("Error updating findings:", error);
      toast.error("Failed to update findings");
    }
  };

  const handleSave = async () => {
    if (!projectName || !assessmentDate) {
      toast.error("Missing project information");
      return;
    }

    try {
      const overallRating = calculateOverallRating(aspects);
      
      const { error } = await supabase
        .from('ratings')
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: 'Data',
          practice_name: 'Data Acquisition and Quality',
          rating: overallRating
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (error) throw error;
      
      toast.success("Data acquisition aspects saved successfully");
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
            <h1 className="text-3xl font-bold">Data Acquisition and Quality Aspects</h1>
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

        <div className="flex justify-end space-x-4">
          <Button onClick={handleSave}>Save Overall Rating</Button>
        </div>
      </div>
    </div>
  );
};

export default DataAcquisitionAspects;