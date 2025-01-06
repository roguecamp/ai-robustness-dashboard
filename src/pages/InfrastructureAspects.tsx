import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { RatingKey } from "@/components/dashboard/RatingKey";
import { calculateOverallRating } from "@/utils/infrastructureScoring";
import { InfrastructureAspectList } from "@/components/infrastructure/InfrastructureAspectList";
import type { InfrastructureAspect } from "@/types/infrastructure";

const infrastructureAspects: InfrastructureAspect[] = [
  {
    name: "Scalable Infrastructure",
    description: "Infrastructure that can scale with growing AI needs.",
    rating: null
  },
  {
    name: "Performance Monitoring",
    description: "Tools and processes to monitor infrastructure performance.",
    rating: null
  },
  {
    name: "Resource Allocation",
    description: "Adequate allocation of resources (e.g., computing, storage).",
    rating: null
  },
  {
    name: "Cost Management",
    description: "Monitoring and managing infrastructure costs.",
    rating: null
  },
  {
    name: "Cloud Adoption",
    description: "Leveraging cloud resources for better scalability and performance.",
    rating: null
  },
  {
    name: "Security Measures",
    description: "Security measures to protect infrastructure.",
    rating: null
  },
  {
    name: "Disaster Recovery",
    description: "Effective disaster recovery and backup solutions.",
    rating: null
  }
];

const InfrastructureAspects = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get("project");
  const assessmentDate = searchParams.get("date");
  
  const [aspects, setAspects] = useState<InfrastructureAspect[]>(infrastructureAspects);

  const handleAspectClick = (index: number) => {
    const ratings: InfrastructureAspect["rating"][] = [
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
      // Save individual aspect ratings
      for (const aspect of aspects) {
        const { error: aspectError } = await supabase
          .from('ratings')
          .upsert({
            project_name: projectName,
            assessment_date: assessmentDate,
            pillar_title: 'Solution',
            practice_name: `Infrastructure:${aspect.name}`,
            rating: aspect.rating
          }, {
            onConflict: 'project_name,assessment_date,pillar_title,practice_name'
          });

        if (aspectError) throw aspectError;
      }

      // Calculate and save the overall infrastructure rating
      const overallRating = calculateOverallRating(aspects);
      
      const { error } = await supabase
        .from('ratings')
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: 'Solution',
          practice_name: 'Infrastructure',
          rating: overallRating
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (error) throw error;
      
      toast.success("Infrastructure aspects saved successfully");
      navigate('/');
    } catch (error) {
      console.error("Error saving ratings:", error);
      toast.error("Failed to save ratings");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Infrastructure Aspects</h1>
            <p className="text-gray-500">Evaluate each aspect to determine overall rating</p>
          </div>
          <div className="flex gap-8">
            <RatingKey />
            <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
          </div>
        </div>

        <InfrastructureAspectList
          aspects={aspects}
          onAspectClick={handleAspectClick}
          projectName={projectName}
          assessmentDate={assessmentDate}
        />

        <div className="flex justify-end space-x-4">
          <Button onClick={handleSave}>Save Overall Rating</Button>
        </div>
      </div>
    </div>
  );
};

export default InfrastructureAspects;