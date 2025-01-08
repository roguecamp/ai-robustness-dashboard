import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { deploymentMonitoringAspects } from "@/types/deployment-monitoring";
import type { DeploymentMonitoringAspect } from "@/types/deployment-monitoring";
import { calculateOverallRating } from "@/utils/deploymentMonitoringScoring";
import { DeploymentMonitoringGrid } from "@/components/deployment-monitoring/DeploymentMonitoringGrid";

const DeploymentMonitoringAspects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectName = queryParams.get('project');
  const assessmentDate = queryParams.get('date');
  
  const [aspects, setAspects] = useState<DeploymentMonitoringAspect[]>(deploymentMonitoringAspects);

  useEffect(() => {
    const loadAspectRatings = async () => {
      if (!projectName || !assessmentDate) return;

      try {
        console.log("Loading deployment monitoring ratings for:", projectName, assessmentDate);
        const { data: ratings, error } = await supabase
          .from('ratings')
          .select('*')
          .eq('project_name', projectName)
          .eq('assessment_date', assessmentDate)
          .eq('pillar_title', 'Solution')
          .like('practice_name', 'DeploymentMonitoring:%');

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          console.log("Loaded ratings:", ratings);
          const updatedAspects = aspects.map(aspect => {
            const matchingRating = ratings.find(r => r.practice_name === `DeploymentMonitoring:${aspect.name}`);
            return {
              ...aspect,
              rating: matchingRating?.rating as DeploymentMonitoringAspect["rating"] || null,
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

  const handleAspectClick = (index: number) => {
    const ratings: DeploymentMonitoringAspect["rating"][] = [
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

  const handleFindingsChange = async (index: number, findings: string) => {
    if (!projectName || !assessmentDate) {
      toast.error("Missing project information");
      return;
    }

    const updatedAspects = [...aspects];
    updatedAspects[index] = {
      ...aspects[index],
      findings
    };
    setAspects(updatedAspects);

    try {
      const { error } = await supabase
        .from('ratings')
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: 'Solution',
          practice_name: `DeploymentMonitoring:${aspects[index].name}`,
          rating: aspects[index].rating,
          findings: findings
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (error) throw error;
      console.log(`Updated findings for ${aspects[index].name}`);
    } catch (error) {
      console.error("Error updating findings:", error);
      toast.error("Failed to save findings");
    }
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
            practice_name: `DeploymentMonitoring:${aspect.name}`,
            rating: aspect.rating,
            findings: aspect.findings
          }, {
            onConflict: 'project_name,assessment_date,pillar_title,practice_name'
          });

        if (aspectError) throw aspectError;
      }

      // Calculate and save the overall rating
      const overallRating = calculateOverallRating(aspects);
      
      const { error } = await supabase
        .from('ratings')
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: 'Solution',
          practice_name: 'Deployment and Monitoring',
          rating: overallRating
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (error) throw error;
      
      toast.success("Deployment and monitoring aspects saved successfully");
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
            <h1 className="text-3xl font-bold">Deployment and Monitoring Aspects</h1>
            <p className="text-gray-500">Evaluate each aspect to determine overall rating</p>
          </div>
          <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
        </div>

        <DeploymentMonitoringGrid
          aspects={aspects}
          onAspectClick={handleAspectClick}
          onFindingsChange={handleFindingsChange}
        />

        <div className="flex justify-end space-x-4">
          <Button onClick={handleSave}>Save Overall Rating</Button>
        </div>
      </div>
    </div>
  );
};

export default DeploymentMonitoringAspects;