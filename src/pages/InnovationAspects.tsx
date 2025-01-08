import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AspectGrid } from "@/components/shared/AspectGrid";
import { useInnovationAspects } from "@/hooks/useInnovationAspects";
import { calculateOverallRating } from "@/utils/innovationScoring";

const InnovationAspects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectName = queryParams.get('project');
  const assessmentDate = queryParams.get('date');
  
  const { aspects, handleAspectClick, handleFindingsChange } = useInnovationAspects(projectName, assessmentDate);

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
            rating: aspect.rating,
            findings: aspect.findings
          }, {
            onConflict: 'project_name,assessment_date,pillar_title,practice_name'
          });

        if (aspectError) throw aspectError;
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

      if (error) throw error;
      
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

        <AspectGrid
          aspects={aspects}
          onAspectClick={handleAspectClick}
          onFindingsChange={handleFindingsChange}
        />

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Overall Rating</Button>
        </div>
      </div>
    </div>
  );
};

export default InnovationAspects;