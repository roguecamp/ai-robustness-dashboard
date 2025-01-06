import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CollaborationAspect } from "@/types/collaboration";
import { calculateOverallRating } from "@/utils/collaborationScoring";
import { AspectCard } from "@/components/collaboration/AspectCard";
import { RatingKey } from "@/components/shared/RatingKey";
import { RatingLevel } from "@/types/ratings";
import { useCollaborationAspects } from "@/hooks/useCollaborationAspects";

export default function CollaborationAspects() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get("project");
  const assessmentDate = searchParams.get("date");
  
  const { aspects, handleAspectClick } = useCollaborationAspects(projectName, assessmentDate);

  const handleSave = async () => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    try {
      console.log("Saving collaboration ratings...");
      
      // Save individual aspect ratings
      for (const aspect of aspects) {
        const { error: aspectError } = await supabase
          .from("ratings")
          .upsert({
            project_name: projectName,
            assessment_date: assessmentDate,
            pillar_title: "People",
            practice_name: `Collaboration:${aspect.name}`,
            rating: aspect.rating
          }, {
            onConflict: 'project_name,assessment_date,pillar_title,practice_name'
          });

        if (aspectError) throw aspectError;
      }

      // Calculate and save the overall rating
      const overallRating = calculateOverallRating(aspects);
      
      const { error } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "People",
          practice_name: "Collaboration",
          rating: overallRating
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (error) throw error;
      
      console.log("Successfully saved collaboration ratings");
      toast.success("Collaboration aspects saved successfully");
      navigate('/');
    } catch (error) {
      console.error("Error saving collaboration ratings:", error);
      toast.error("Failed to save ratings");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Collaboration Aspects</h1>
            <p className="text-gray-600">
              Rate each aspect of Collaboration by clicking on the cards. Click multiple times to cycle through ratings.
            </p>
          </div>
          <div className="flex gap-4 items-start">
            <RatingKey />
            <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
          </div>
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

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Overall Rating</Button>
        </div>
      </div>
    </div>
  );
}