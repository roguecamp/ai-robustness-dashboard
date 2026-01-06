import { useEffect } from "react";
import { Toaster } from "sonner";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { PillarGrid } from "./dashboard/PillarGrid";
import { SaveRatingsButton } from "./dashboard/SaveRatingsButton";
import { useDashboardStore } from "./dashboard/DashboardState";
import { Pillar, KeyPractice, RatingLevel } from "@/types/ratings";
import { practiceToAspectPrefix, calculateRatingFromAspects } from "@/utils/practiceRatingCalculator";

const pillars: Pillar[] = [
  {
    title: "People",
    description: "Team expertise and AI literacy",
    color: "#FF6B6B",
    keyPractices: [
      { name: "Training and Upskilling", rating: null, findings: null, owners: null },
      { name: "Collaboration", rating: null, findings: null, owners: null },
      { name: "Change Management", rating: null, findings: null, owners: null },
    ],
  },
  {
    title: "Strategy",
    description: "AI implementation and business alignment",
    color: "#9b87f5",
    keyPractices: [
      { name: "Business Alignment", rating: null, findings: null, owners: null },
      { name: "Scalability and Adoption", rating: null, findings: null, owners: null },
      { name: "Innovation Framework", rating: null, findings: null, owners: null },
    ],
  },
  {
    title: "Data",
    description: "Data quality and management practices",
    color: "#45B7D1",
    keyPractices: [
      { name: "Data Acquisition and Quality", rating: null, findings: null, owners: null },
      { name: "Data Governance", rating: null, findings: null, owners: null },
      { name: "Data Privacy", rating: null, findings: null, owners: null },
    ],
  },
  {
    title: "Legal",
    description: "Compliance and regulatory adherence",
    color: "#96CEB4",
    keyPractices: [
      { name: "Intellectual Property", rating: null, findings: null, owners: null },
      { name: "Ethical Considerations", rating: null, findings: null, owners: null },
      { name: "Compliance and Regulation", rating: null, findings: null, owners: null },
    ],
  },
  {
    title: "Solution",
    description: "AI system effectiveness and reliability",
    color: "#222222",
    keyPractices: [
      { name: "Infrastructure", rating: null, findings: null, owners: null },
      { name: "Model Development and Training", rating: null, findings: null, owners: null },
      { name: "Deployment and Monitoring", rating: null, findings: null, owners: null },
    ],
  },
  {
    title: "Security",
    description: "Horizontal Aspect - System security and risk management",
    color: "#D4A5A5",
    keyPractices: [
      { name: "Training and Awareness", rating: null, findings: null, owners: null },
      { name: "Risk Assessment", rating: null, findings: null, owners: null },
      { name: "Data Leak Protection", rating: null, findings: null, owners: null },
      { name: "Crisis Continuity Planning", rating: null, findings: null, owners: null },
      { name: "Intrusion Detection", rating: null, findings: null, owners: null },
      { name: "Roles and Responsibilities", rating: null, findings: null, owners: null },
      { name: "Investment", rating: null, findings: null, owners: null },
      { name: "Access Restriction", rating: null, findings: null, owners: null },
      { name: "Contractual Obligations", rating: null, findings: null, owners: null },
      { name: "Testing and Validation", rating: null, findings: null, owners: null },
    ],
  },
];

const isValidRating = (rating: string | null): rating is RatingLevel => {
  return rating === "Largely in Place" || 
         rating === "Somewhat in Place" || 
         rating === "Not in Place";
};

export const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    projectName, 
    assessmentDate, 
    setProjectName, 
    setAssessmentDate,
    setPillarRatings,
    resetPillarRatings,
    pillarRatings 
  } = useDashboardStore();

  useEffect(() => {
    const projectParam = searchParams.get('project');
    const dateParam = searchParams.get('date');
    
    if (projectParam && projectParam !== projectName) {
      console.log('Setting project name from URL:', projectParam);
      setProjectName(projectParam);
    }
    
    if (dateParam && dateParam !== assessmentDate) {
      console.log('Setting assessment date from URL:', dateParam);
      setAssessmentDate(dateParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!projectName || !assessmentDate) {
      console.log('Missing project name or assessment date, resetting ratings');
      resetPillarRatings();
      return;
    }

    const loadRatings = async () => {
      try {
        console.log('Loading ratings for project:', projectName, 'date:', assessmentDate);
        const { data: ratings, error } = await supabase
          .from("ratings")
          .select("*")
          .eq("project_name", projectName)
          .eq("assessment_date", assessmentDate);

        if (error) {
          console.error('Error loading ratings:', error);
          toast.error("Failed to load ratings: " + error.message);
          throw error;
        }

        if (ratings && ratings.length > 0) {
          console.log('Found ratings:', ratings);
          const pillarRatingsMap: Record<string, KeyPractice[]> = {};
          
          // Initialize all pillars with default practices
          pillars.forEach(pillar => {
            pillarRatingsMap[pillar.title] = pillar.keyPractices.map(p => ({ ...p }));
          });

          // Group aspect ratings by practice
          const aspectRatingsByPractice: Record<string, Record<string, (string | null)[]>> = {};
          
          pillars.forEach(pillar => {
            aspectRatingsByPractice[pillar.title] = {};
            pillar.keyPractices.forEach(practice => {
              aspectRatingsByPractice[pillar.title][practice.name] = [];
            });
          });

          // Process all ratings
          ratings.forEach(rating => {
            const pillarTitle = rating.pillar_title;
            const practiceName = rating.practice_name;
            
            // Check if this is a main practice rating (no colon)
            if (!practiceName.includes(':')) {
              // This is a main practice rating - only use if valid
              const pillar = pillars.find(p => p.title === pillarTitle);
              if (pillar) {
                const practice = pillar.keyPractices.find(p => p.name === practiceName);
                if (practice && isValidRating(rating.rating)) {
                  const practiceIndex = pillarRatingsMap[pillarTitle].findIndex(
                    p => p.name === practice.name
                  );
                  if (practiceIndex !== -1) {
                    // Only set if we don't have aspect ratings to calculate from
                    pillarRatingsMap[pillarTitle][practiceIndex] = {
                      name: practice.name,
                      rating: rating.rating,
                      findings: rating.findings || null,
                      owners: (rating as any).owners || null
                    };
                  }
                }
              }
            } else {
              // This is an aspect rating - collect it for calculation
              const pillar = pillars.find(p => p.title === pillarTitle);
              if (pillar) {
                // Find which practice this aspect belongs to
                for (const practice of pillar.keyPractices) {
                  const prefix = practiceToAspectPrefix[practice.name];
                  if (prefix && practiceName.startsWith(prefix)) {
                    aspectRatingsByPractice[pillarTitle][practice.name].push(rating.rating);
                    break;
                  }
                }
              }
            }
          });

          // Calculate overall ratings from aspects where available
          pillars.forEach(pillar => {
            pillar.keyPractices.forEach(practice => {
              const aspectRatings = aspectRatingsByPractice[pillar.title][practice.name];
              if (aspectRatings.length > 0) {
                const calculatedRating = calculateRatingFromAspects(aspectRatings);
                if (calculatedRating) {
                  const practiceIndex = pillarRatingsMap[pillar.title].findIndex(
                    p => p.name === practice.name
                  );
                  if (practiceIndex !== -1) {
                    pillarRatingsMap[pillar.title][practiceIndex].rating = calculatedRating;
                    console.log(`Calculated rating for ${pillar.title} - ${practice.name} from ${aspectRatings.length} aspects:`, calculatedRating);
                  }
                }
              }
            });
          });

          console.log('Setting pillar ratings:', pillarRatingsMap);
          setPillarRatings(pillarRatingsMap);
          toast.success(`Loaded ratings for ${projectName}`);
        } else {
          const { data: projectExists } = await supabase
            .from("ratings")
            .select("project_name")
            .eq("project_name", projectName)
            .limit(1);

          if (projectExists && projectExists.length > 0) {
            console.log('No ratings found for existing project:', projectName);
            toast.info("No existing ratings found for this project");
          } else {
            console.log('Project does not exist in database:', projectName);
          }
          resetPillarRatings();
        }
      } catch (error) {
        console.error("Error loading ratings:", error);
        toast.error("Failed to load ratings");
        resetPillarRatings();
      }
    };

    if (projectName.trim().length > 0) {
      loadRatings();
    }
  }, [projectName, assessmentDate]);

  useEffect(() => {
    if (projectName || assessmentDate) {
      const params = new URLSearchParams(searchParams);
      if (projectName) {
        params.set('project', projectName);
      }
      if (assessmentDate) {
        params.set('date', assessmentDate);
      }
      setSearchParams(params);
    }
  }, [projectName, assessmentDate]);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto space-y-8">
        <DashboardHeader />
        <PillarGrid pillars={pillars} />
        <SaveRatingsButton />
      </div>
      <Toaster />
    </div>
  );
};