import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { BaseAspect, RatingLevel } from "@/types/ratings";
import { getNextRating } from "@/utils/ratingUtils";
import { aspectConfigs, type AspectConfig } from "@/config/aspectDefinitions";

interface UseAspectsResult {
  aspects: BaseAspect[];
  isLoading: boolean;
  handleAspectClick: (index: number) => Promise<void>;
  handleFindingsChange: (index: number, findings: string) => Promise<void>;
  handleOwnersChange: (index: number, owners: string) => Promise<void>;
}

export const useAspects = (
  configKey: string,
  projectName: string | null,
  assessmentDate: string | null
): UseAspectsResult => {
  const config = aspectConfigs[configKey];
  
  if (!config) {
    throw new Error(`Unknown aspect config key: ${configKey}`);
  }

  const [aspects, setAspects] = useState<BaseAspect[]>(
    config.initialAspects.map(a => ({ ...a }))
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRatings = async () => {
      if (!projectName || !assessmentDate) {
        setAspects(config.initialAspects.map(a => ({ ...a })));
        setIsLoading(false);
        return;
      }

      try {
        const { data: ratings, error } = await supabase
          .from("ratings")
          .select("*")
          .eq("project_name", projectName)
          .eq("assessment_date", assessmentDate)
          .eq("pillar_title", config.pillarTitle)
          .like("practice_name", `${config.practicePrefix}%`);

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          const updatedAspects = config.initialAspects.map(aspect => {
            const matchingRating = ratings.find(
              r => r.practice_name === `${config.practicePrefix}${aspect.name}`
            );
            return {
              ...aspect,
              rating: (matchingRating?.rating as RatingLevel) || null,
              findings: matchingRating?.findings || "",
              owners: matchingRating?.owners || ""
            };
          });
          setAspects(updatedAspects);
        } else {
          setAspects(config.initialAspects.map(a => ({ ...a })));
        }
      } catch (error) {
        console.error(`Error loading ${configKey} ratings:`, error);
        toast.error("Failed to load ratings");
        setAspects(config.initialAspects.map(a => ({ ...a })));
      } finally {
        setIsLoading(false);
      }
    };

    loadRatings();
  }, [projectName, assessmentDate, configKey]);

  const upsertRating = useCallback(async (aspect: BaseAspect) => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return false;
    }

    const { error } = await supabase
      .from("ratings")
      .upsert({
        project_name: projectName,
        assessment_date: assessmentDate,
        pillar_title: config.pillarTitle,
        practice_name: `${config.practicePrefix}${aspect.name}`,
        rating: aspect.rating,
        findings: aspect.findings,
        owners: aspect.owners
      }, {
        onConflict: 'project_name,assessment_date,pillar_title,practice_name'
      });

    if (error) throw error;
    return true;
  }, [projectName, assessmentDate, config]);

  const handleAspectClick = useCallback(async (index: number) => {
    const nextRating = getNextRating(aspects[index].rating);
    const updatedAspect = { ...aspects[index], rating: nextRating };

    try {
      await upsertRating(updatedAspect);
      setAspects(prev => {
        const newAspects = [...prev];
        newAspects[index] = updatedAspect;
        return newAspects;
      });
    } catch (error) {
      console.error("Error updating rating:", error);
      toast.error("Failed to update rating");
    }
  }, [aspects, upsertRating]);

  const handleFindingsChange = useCallback(async (index: number, findings: string) => {
    const updatedAspect = { ...aspects[index], findings };

    try {
      await upsertRating(updatedAspect);
      setAspects(prev => {
        const newAspects = [...prev];
        newAspects[index] = updatedAspect;
        return newAspects;
      });
    } catch (error) {
      console.error("Error updating findings:", error);
      toast.error("Failed to update findings");
    }
  }, [aspects, upsertRating]);

  const handleOwnersChange = useCallback(async (index: number, owners: string) => {
    const updatedAspect = { ...aspects[index], owners };

    try {
      await upsertRating(updatedAspect);
      setAspects(prev => {
        const newAspects = [...prev];
        newAspects[index] = updatedAspect;
        return newAspects;
      });
    } catch (error) {
      console.error("Error updating owners:", error);
      toast.error("Failed to update owners");
    }
  }, [aspects, upsertRating]);

  return {
    aspects,
    isLoading,
    handleAspectClick,
    handleFindingsChange,
    handleOwnersChange
  };
};
