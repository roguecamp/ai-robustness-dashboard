import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AspectCard } from "@/components/change-management/AspectCard";
import { calculateOverallRating } from "@/utils/changeManagementScoring";
import type { ChangeManagementAspect } from "@/types/change-management";

const changeManagementAspects: ChangeManagementAspect[] = [
  {
    name: "Change Strategy",
    description: "Clearly defined and communicated change management strategy for AI transformation.",
    rating: null,
    findings: ""
  },
  {
    name: "Employee Engagement",
    description: "Level of employee engagement during AI-driven changes.",
    rating: null,
    findings: ""
  },
  {
    name: "Communication Channels",
    description: "Effective communication channels for addressing concerns and sharing progress.",
    rating: null,
    findings: ""
  },
  {
    name: "Change Metrics",
    description: "Metrics to evaluate the success of change management initiatives.",
    rating: null,
    findings: ""
  },
  {
    name: "Resistance Management",
    description: "Strategies to manage resistance to new AI technologies.",
    rating: null,
    findings: ""
  },
  {
    name: "Support Structures",
    description: "Availability of support structures to assist employees during the transition.",
    rating: null,
    findings: ""
  },
  {
    name: "Change Network",
    description: "Establishing a network of change advocates within the organization.",
    rating: null,
    findings: ""
  }
];

const ChangeManagementAspects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectName = queryParams.get('project');
  const assessmentDate = queryParams.get('date');
  
  const [aspects, setAspects] = useState<ChangeManagementAspect[]>(changeManagementAspects);

  useEffect(() => {
    const loadAspectRatings = async () => {
      if (!projectName || !assessmentDate) return;

      try {
        const { data: ratings, error } = await supabase
          .from('ratings')
          .select('practice_name, rating, findings')
          .eq('project_name', projectName)
          .eq('assessment_date', assessmentDate)
          .eq('pillar_title', 'People')
          .like('practice_name', 'ChangeManagement:%');

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          const updatedAspects = aspects.map(aspect => {
            const matchingRating = ratings.find(r => r.practice_name === `ChangeManagement:${aspect.name}`);
            return {
              ...aspect,
              rating: matchingRating?.rating as ChangeManagementAspect["rating"] || null,
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
    const ratings: ChangeManagementAspect["rating"][] = [
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
    if (!projectName || !assessmentDate) return;

    try {
      const { error } = await supabase
        .from('ratings')
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: 'People',
          practice_name: `ChangeManagement:${aspects[index].name}`,
          rating: aspects[index].rating,
          findings: findings
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (error) throw error;

      const updatedAspects = [...aspects];
      updatedAspects[index] = {
        ...aspects[index],
        findings: findings
      };
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
      // Save individual aspect ratings
      for (const aspect of aspects) {
        console.log(`Saving aspect: ${aspect.name} with rating: ${aspect.rating}`);
        const { error: aspectError } = await supabase
          .from('ratings')
          .upsert({
            project_name: projectName,
            assessment_date: assessmentDate,
            pillar_title: 'People',
            practice_name: `ChangeManagement:${aspect.name}`,
            rating: aspect.rating,
            findings: aspect.findings
          }, {
            onConflict: 'project_name,assessment_date,pillar_title,practice_name'
          });

        if (aspectError) {
          console.error(`Error saving aspect ${aspect.name}:`, aspectError);
          throw aspectError;
        }
      }

      // Calculate and save the overall change management rating
      const overallRating = calculateOverallRating(aspects);
      console.log('Saving overall change management rating:', overallRating);
      
      const { error } = await supabase
        .from('ratings')
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: 'People',
          practice_name: 'Change Management',
          rating: overallRating
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (error) {
        console.error('Error saving overall rating:', error);
        throw error;
      }
      
      toast.success("Change management aspects saved successfully");
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
            <h1 className="text-3xl font-bold">Change Management Aspects</h1>
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

export default ChangeManagementAspects;
