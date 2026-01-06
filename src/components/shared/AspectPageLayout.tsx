import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AspectGrid } from "./AspectGrid";
import { useAspects } from "@/hooks/useAspects";
import { calculateOverallRating } from "@/utils/ratingUtils";
import { aspectConfigs } from "@/config/aspectDefinitions";

interface AspectPageLayoutProps {
  configKey: string;
  title: string;
  description: string;
  mainPracticeName: string;
}

export function AspectPageLayout({
  configKey,
  title,
  description,
  mainPracticeName
}: AspectPageLayoutProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get("project");
  const assessmentDate = searchParams.get("date");

  const config = aspectConfigs[configKey];
  const { aspects, isLoading, handleAspectClick, handleFindingsChange, handleOwnersChange } = 
    useAspects(configKey, projectName, assessmentDate);

  const handleSave = async () => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    try {
      const overallRating = calculateOverallRating(aspects.map(a => a.rating));
      
      const { error } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: config.pillarTitle,
          practice_name: mainPracticeName,
          rating: overallRating
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (error) throw error;
      
      toast.success(`${title} saved successfully`);
      navigate(`/?project=${projectName}&date=${assessmentDate}`);
    } catch (error) {
      console.error("Error saving ratings:", error);
      toast.error("Failed to save ratings");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-5xl mx-auto">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            <p className="text-gray-600">{description}</p>
          </div>
          <Button onClick={() => navigate(`/?project=${projectName}&date=${assessmentDate}`)}>
            Back to Dashboard
          </Button>
        </div>

        <AspectGrid
          aspects={aspects}
          onAspectClick={handleAspectClick}
          onFindingsChange={handleFindingsChange}
          onOwnersChange={handleOwnersChange}
        />

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Overall Rating</Button>
        </div>
      </div>
    </div>
  );
}
