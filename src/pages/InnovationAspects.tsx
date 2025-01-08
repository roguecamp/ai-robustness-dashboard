import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AspectGrid } from "@/components/shared/AspectGrid";
import { useInnovationAspects } from "@/hooks/useInnovationAspects";
import { calculateOverallRating } from "@/utils/innovationScoring";

const InnovationAspects = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get("project");
  const assessmentDate = searchParams.get("date");
  
  const { aspects, handleAspectClick, handleFindingsChange } = useInnovationAspects(projectName, assessmentDate);

  const handleSave = async () => {
    if (!projectName || !assessmentDate) {
      toast.error("Missing project information");
      return;
    }

    try {
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
      
      console.log('Successfully saved innovation rating:', overallRating);
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

        <div className="flex justify-end space-x-4">
          <Button onClick={handleSave}>Save Overall Rating</Button>
        </div>
      </div>
    </div>
  );
};

export default InnovationAspects;