import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CollaborationAspect {
  name: string;
  description: string;
  rating: "Largely in Place" | "Somewhat in Place" | "Not in Place" | null;
}

const collaborationAspects: CollaborationAspect[] = [
  {
    name: "Interdisciplinary Teams",
    description: "Existence and effectiveness of cross-functional teams.",
    rating: null
  },
  {
    name: "External Partnerships",
    description: "Relationships with external AI consultants, vendors, and academic institutions.",
    rating: null
  },
  {
    name: "Collaboration Tools",
    description: "Availability and utilization of collaborative tools.",
    rating: null
  },
  {
    name: "Knowledge Sharing",
    description: "Platforms and practices for sharing AI knowledge across the organization.",
    rating: null
  },
  {
    name: "Project Management",
    description: "Effectiveness in managing AI projects across different teams.",
    rating: null
  },
  {
    name: "Innovation Culture",
    description: "Encouragement and support for innovative ideas and experimentation.",
    rating: null
  },
  {
    name: "Feedback Loops",
    description: "Mechanisms for collecting and acting on feedback from various stakeholders.",
    rating: null
  }
];

const CollaborationAspects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectName = queryParams.get('project');
  const assessmentDate = queryParams.get('date');
  
  const [aspects, setAspects] = useState<CollaborationAspect[]>(collaborationAspects);

  const getRatingColor = (rating: CollaborationAspect["rating"]) => {
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

  const handleRatingChange = (index: number) => {
    const ratings: CollaborationAspect["rating"][] = [
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

  const calculateOverallRating = () => {
    const ratingScores = {
      "Largely in Place": 2,
      "Somewhat in Place": 1,
      "Not in Place": 0
    };

    const totalScore = aspects.reduce((sum, aspect) => {
      return sum + (aspect.rating ? ratingScores[aspect.rating] : 0);
    }, 0);

    const maxScore = aspects.length * 2;
    const percentage = (totalScore / maxScore) * 100;

    if (percentage >= 70) return "Largely in Place";
    if (percentage >= 30) return "Somewhat in Place";
    return "Not in Place";
  };

  const handleSave = async () => {
    if (!projectName || !assessmentDate) {
      toast.error("Missing project information");
      return;
    }

    try {
      const overallRating = calculateOverallRating();
      
      const { error } = await supabase
        .from("ratings")
        .insert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "People",
          practice_name: "Collaboration",
          rating: overallRating
        })
        .select();

      if (error) throw error;
      
      toast.success("Collaboration aspects saved successfully");
      navigate('/');
    } catch (error) {
      console.error("Error saving rating:", error);
      toast.error("Failed to save rating");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Collaboration Aspects</h1>
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

export default CollaborationAspects;