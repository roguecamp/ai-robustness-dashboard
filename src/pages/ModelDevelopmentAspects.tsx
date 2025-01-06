import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { modelDevelopmentAspects, type ModelDevelopmentAspect } from "@/types/model-development";
import { calculateOverallRating } from "@/utils/modelDevelopmentScoring";

const ModelDevelopmentAspects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectName = queryParams.get('project');
  const assessmentDate = queryParams.get('date');
  
  const [aspects, setAspects] = useState<ModelDevelopmentAspect[]>(modelDevelopmentAspects);

  useEffect(() => {
    const loadAspectRatings = async () => {
      if (!projectName || !assessmentDate) return;

      try {
        console.log('Loading Model Development aspect ratings for:', projectName, assessmentDate);
        const { data: ratings, error } = await supabase
          .from('ratings')
          .select('practice_name, rating')
          .eq('project_name', projectName)
          .eq('assessment_date', assessmentDate)
          .eq('pillar_title', 'Solution')
          .like('practice_name', 'ModelDevelopment:%');

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          console.log('Loaded Model Development ratings:', ratings);
          const updatedAspects = aspects.map(aspect => {
            const matchingRating = ratings.find(r => r.practice_name === `ModelDevelopment:${aspect.name}`);
            return {
              ...aspect,
              rating: matchingRating?.rating as ModelDevelopmentAspect["rating"] || null
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

  const getRatingColor = (rating: ModelDevelopmentAspect["rating"]) => {
    switch (rating) {
      case "Largely in Place":
        return "bg-green-700 text-white";
      case "Somewhat in Place":
        return "bg-green-300";
      case "Not in Place":
        return "bg-white border border-gray-200";
      default:
        return "bg-gray-100 border border-gray-200";
    }
  };

  const handleRatingChange = async (index: number) => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    const ratings: ModelDevelopmentAspect["rating"][] = [
      "Largely in Place",
      "Somewhat in Place",
      "Not in Place"
    ];
    
    const updatedAspects = [...aspects];
    const currentRating = aspects[index].rating;
    const currentIndex = currentRating ? ratings.indexOf(currentRating) : -1;
    const nextIndex = (currentIndex + 1) % ratings.length;
    const newRating = ratings[nextIndex];
    
    updatedAspects[index] = {
      ...aspects[index],
      rating: newRating
    };

    try {
      console.log(`Saving individual rating for ${aspects[index].name}:`, newRating);
      const { error } = await supabase
        .from('ratings')
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: 'Solution',
          practice_name: `ModelDevelopment:${aspects[index].name}`,
          rating: newRating
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (error) throw error;
      
      setAspects(updatedAspects);
    } catch (error) {
      console.error("Error saving rating:", error);
      toast.error("Failed to save rating");
    }
  };

  const handleSave = async () => {
    if (!projectName || !assessmentDate) {
      toast.error("Missing project information");
      return;
    }

    try {
      // Calculate and save the overall rating
      const overallRating = calculateOverallRating(aspects);
      console.log('Saving overall Model Development rating:', overallRating);
      
      const { error } = await supabase
        .from('ratings')
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: 'Solution',
          practice_name: 'Model Development and Training',
          rating: overallRating
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (error) throw error;
      
      toast.success("Model development aspects saved successfully");
      navigate('/');
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
            <h1 className="text-3xl font-bold">Model Development and Training Aspects</h1>
            <p className="text-gray-500">Evaluate each aspect to determine overall rating</p>
          </div>
          <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
        </div>

        <div className="grid gap-4">
          {aspects.map((aspect, index) => (
            <Card
              key={aspect.name}
              className={`p-4 cursor-pointer transition-colors duration-200 ${getRatingColor(aspect.rating)}`}
              onClick={() => handleRatingChange(index)}
            >
              <h3 className="font-semibold">{aspect.name}</h3>
              <p className="text-sm mt-1">{aspect.description}</p>
            </Card>
          ))}
        </div>

        <div className="flex justify-end space-x-4">
          <Button onClick={handleSave}>Save Overall Rating</Button>
        </div>
      </div>
    </div>
  );
};

export default ModelDevelopmentAspects;