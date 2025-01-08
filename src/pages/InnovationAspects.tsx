import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AspectCard } from "@/components/innovation/AspectCard";
import { calculateOverallRating } from "@/utils/innovationScoring";
import type { InnovationAspect } from "@/types/innovation";

const innovationAspects: InnovationAspect[] = [
  {
    name: "Innovation Labs",
    description: "Existence and utilization of innovation labs for testing AI solutions.",
    rating: null,
    findings: ""
  },
  {
    name: "Agile Methodology",
    description: "Adoption of agile methodologies in AI development cycles.",
    rating: null,
    findings: ""
  },
  {
    name: "Proof of Concept (POC) Processes",
    description: "Structured processes for developing and evaluating POCs.",
    rating: null,
    findings: ""
  },
  {
    name: "Risk Tolerance",
    description: "Willingness to invest in innovative but risky AI projects.",
    rating: null,
    findings: ""
  },
  {
    name: "Idea Generation",
    description: "Processes for generating and evaluating new AI ideas.",
    rating: null,
    findings: ""
  },
  {
    name: "Experimentation Culture",
    description: "Encouragement of experimentation and learning from failures.",
    rating: null,
    findings: ""
  },
  {
    name: "Scalability Assessments",
    description: "Processes to assess the scalability of innovative solutions.",
    rating: null,
    findings: ""
  }
];

const InnovationAspects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectName = queryParams.get('project');
  const assessmentDate = queryParams.get('date');
  
  const [aspects, setAspects] = useState<InnovationAspect[]>(innovationAspects);

  useEffect(() => {
    const loadAspectRatings = async () => {
      if (!projectName || !assessmentDate) return;

      try {
        const { data: ratings, error } = await supabase
          .from('ratings')
          .select('practice_name, rating')
          .eq('project_name', projectName)
          .eq('assessment_date', assessmentDate)
          .eq('pillar_title', 'Strategy')
          .like('practice_name', 'Innovation:%');

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          const updatedAspects = aspects.map(aspect => {
            const matchingRating = ratings.find(r => r.practice_name === `Innovation:${aspect.name}`);
            return {
              ...aspect,
              rating: matchingRating?.rating as InnovationAspect["rating"] || null
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
    const ratings: InnovationAspect["rating"][] = [
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
        console.log(`Saving aspect: ${aspect.name} with rating: ${aspect.rating}`);
        const { error: aspectError } = await supabase
          .from('ratings')
          .upsert({
            project_name: projectName,
            assessment_date: assessmentDate,
            pillar_title: 'Strategy',
            practice_name: `Innovation:${aspect.name}`,
            rating: aspect.rating
          }, {
            onConflict: 'project_name,assessment_date,pillar_title,practice_name'
          });

        if (aspectError) {
          console.error(`Error saving aspect ${aspect.name}:`, aspectError);
          throw aspectError;
        }
      }

      // Calculate and save the overall innovation rating
      const overallRating = calculateOverallRating(aspects);
      console.log('Saving overall innovation rating:', overallRating);
      
      const { error } = await supabase
        .from('ratings')
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: 'Strategy',
          practice_name: 'Innovation Framework',
          rating: overallRating
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (error) {
        console.error('Error saving overall rating:', error);
        throw error;
      }
      
      toast.success("Innovation aspects saved successfully");
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
            <h1 className="text-3xl font-bold">Innovation Framework Aspects</h1>
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

export default InnovationAspects;
