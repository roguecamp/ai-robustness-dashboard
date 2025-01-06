import { useState, useEffect } from "react";
import { AspectCard } from "./AspectCard";
import { supabase } from "@/integrations/supabase/client";
import type { InfrastructureAspect } from "@/types/infrastructure";

interface InfrastructureAspectListProps {
  projectName: string | null;
  assessmentDate: string | null;
  aspects: InfrastructureAspect[];
  onAspectClick: (index: number) => void;
}

export const InfrastructureAspectList = ({
  projectName,
  assessmentDate,
  aspects,
  onAspectClick,
}: InfrastructureAspectListProps) => {
  const [loadedAspects, setLoadedAspects] = useState<InfrastructureAspect[]>(aspects);

  useEffect(() => {
    const loadAspectRatings = async () => {
      if (!projectName || !assessmentDate) return;

      try {
        const { data: ratings, error } = await supabase
          .from('ratings')
          .select('practice_name, rating')
          .eq('project_name', projectName)
          .eq('assessment_date', assessmentDate)
          .eq('pillar_title', 'Solution')
          .like('practice_name', 'Infrastructure:%');

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          const updatedAspects = aspects.map(aspect => {
            const matchingRating = ratings.find(r => r.practice_name === `Infrastructure:${aspect.name}`);
            return {
              ...aspect,
              rating: matchingRating?.rating as InfrastructureAspect["rating"] || null
            };
          });
          setLoadedAspects(updatedAspects);
        }
      } catch (error) {
        console.error("Error loading ratings:", error);
      }
    };

    loadAspectRatings();
  }, [projectName, assessmentDate, aspects]);

  return (
    <div className="grid gap-4">
      {loadedAspects.map((aspect, index) => (
        <AspectCard
          key={aspect.name}
          aspect={aspect}
          onClick={() => onAspectClick(index)}
        />
      ))}
    </div>
  );
};