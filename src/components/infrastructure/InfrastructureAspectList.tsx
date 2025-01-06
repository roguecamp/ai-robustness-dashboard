import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AspectCard } from "./AspectCard";
import type { InfrastructureAspect } from "@/types/infrastructure";

interface InfrastructureAspectListProps {
  aspects: InfrastructureAspect[];
  onAspectClick: (index: number) => void;
  projectName: string | null;
  assessmentDate: string | null;
}

export const InfrastructureAspectList = ({
  aspects,
  onAspectClick,
  projectName,
  assessmentDate,
}: InfrastructureAspectListProps) => {
  useEffect(() => {
    const loadRatings = async () => {
      if (!projectName || !assessmentDate) return;

      try {
        const { data: ratings, error } = await supabase
          .from("ratings")
          .select("*")
          .eq("project_name", projectName)
          .eq("assessment_date", assessmentDate)
          .eq("pillar_title", "Solution")
          .like("practice_name", "Infrastructure:%");

        if (error) throw error;

        console.log("Loaded infrastructure ratings:", ratings);
      } catch (error) {
        console.error("Error loading infrastructure ratings:", error);
        toast.error("Failed to load ratings");
      }
    };

    loadRatings();
  }, [projectName, assessmentDate]);

  return (
    <div className="space-y-4">
      {aspects.map((aspect, index) => (
        <AspectCard
          key={aspect.name}
          aspect={aspect}
          onClick={() => onAspectClick(index)}
        />
      ))}
    </div>
  );
};