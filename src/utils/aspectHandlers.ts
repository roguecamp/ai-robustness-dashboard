import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const handleFindingsChange = async (
  index: number,
  findings: string,
  projectName: string | null,
  assessmentDate: string | null,
  pillarTitle: string,
  practiceName: string,
  rating: string | null
) => {
  if (!projectName || !assessmentDate) {
    toast.error("Project name and assessment date are required");
    return;
  }

  try {
    const { error } = await supabase
      .from("ratings")
      .upsert({
        project_name: projectName,
        assessment_date: assessmentDate,
        pillar_title: pillarTitle,
        practice_name: practiceName,
        rating: rating,
        findings: findings
      }, {
        onConflict: 'project_name,assessment_date,pillar_title,practice_name'
      });

    if (error) throw error;
  } catch (error) {
    console.error("Error updating findings:", error);
    toast.error("Failed to update findings");
  }
};