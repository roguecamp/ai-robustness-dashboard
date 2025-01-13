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

const pillars: Pillar[] = [
  {
    title: "People",
    description: "Team expertise and AI literacy",
    color: "#FF6B6B",
    keyPractices: [
      { name: "Training and Upskilling", rating: null, findings: null },
      { name: "Collaboration", rating: null, findings: null },
      { name: "Change Management", rating: null, findings: null },
    ],
  },
  {
    title: "Strategy",
    description: "AI implementation and business alignment",
    color: "#9b87f5",
    keyPractices: [
      { name: "Business Alignment", rating: null, findings: null },
      { name: "Scalability and Adoption", rating: null, findings: null },
      { name: "Innovation Framework", rating: null, findings: null },
    ],
  },
  {
    title: "Data",
    description: "Data quality and management practices",
    color: "#45B7D1",
    keyPractices: [
      { name: "Data Acquisition and Quality", rating: null, findings: null },
      { name: "Data Governance", rating: null, findings: null },
      { name: "Data Privacy", rating: null, findings: null },
    ],
  },
  {
    title: "Legal",
    description: "Compliance and regulatory adherence",
    color: "#96CEB4",
    keyPractices: [
      { name: "Intellectual Property", rating: null, findings: null },
      { name: "Ethical Considerations", rating: null, findings: null },
      { name: "Compliance and Regulation", rating: null, findings: null },
    ],
  },
  {
    title: "Solution",
    description: "AI system effectiveness and reliability",
    color: "#222222",
    keyPractices: [
      { name: "Infrastructure", rating: null, findings: null },
      { name: "Model Development and Training", rating: null, findings: null },
      { name: "Deployment and Monitoring", rating: null, findings: null },
    ],
  },
  {
    title: "Security",
    description: "Horizontal Aspect - System security and risk management",
    color: "#D4A5A5",
    keyPractices: [
      { name: "Training and Awareness", rating: null, findings: null },
      { name: "Risk Assessment", rating: null, findings: null },
      { name: "Data Leak Protection", rating: null, findings: null },
      { name: "Crisis Continuity Planning", rating: null, findings: null },
      { name: "Intrusion Detection", rating: null, findings: null },
      { name: "Roles and Responsibilities", rating: null, findings: null },
      { name: "Investment", rating: null, findings: null },
      { name: "Access Restriction", rating: null, findings: null },
      { name: "Contractual Obligations", rating: null, findings: null },
      { name: "Testing and Validation", rating: null, findings: null },
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

  // Initialize state from URL parameters
  useEffect(() => {
    const projectParam = searchParams.get('project');
    const dateParam = searchParams.get('date');
    
    if (projectParam) {
      console.log('Setting project name from URL:', projectParam);
      setProjectName(projectParam);
    } else {
      console.log('No project name in URL, resetting state');
      setProjectName('');
      resetPillarRatings();
    }
    
    if (dateParam) {
      console.log('Setting assessment date from URL:', dateParam);
      setAssessmentDate(dateParam);
    }
  }, [searchParams]);

  // Load or reset ratings based on project name and assessment date
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
            pillarRatingsMap[pillar.title] = [...pillar.keyPractices];
          });

          // Update with actual ratings from database
          let updatedCount = 0;
          ratings.forEach(rating => {
            const pillarTitle = rating.pillar_title;
            const practiceName = rating.practice_name;
            
            if (pillarRatingsMap[pillarTitle]) {
              const practiceIndex = pillarRatingsMap[pillarTitle].findIndex(
                p => p.name === practiceName
              );
              
              if (practiceIndex !== -1 && isValidRating(rating.rating)) {
                pillarRatingsMap[pillarTitle][practiceIndex] = {
                  name: practiceName,
                  rating: rating.rating,
                  findings: rating.findings || null
                };
                updatedCount++;
                console.log(`Updated rating for ${pillarTitle} - ${practiceName}:`, rating.rating);
              }
            }
          });

          console.log(`Successfully loaded ${updatedCount} ratings`);
          setPillarRatings(pillarRatingsMap);
          toast.success(`Loaded ${updatedCount} ratings for ${projectName}`);
        } else {
          console.log('No ratings found, using default values');
          resetPillarRatings();
          toast.info("No existing ratings found for this project");
        }
      } catch (error) {
        console.error("Error loading ratings:", error);
        toast.error("Failed to load ratings");
        resetPillarRatings();
      }
    };

    loadRatings();
  }, [projectName, assessmentDate]);

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (projectName) {
      params.set('project', projectName);
    } else {
      params.delete('project');
    }
    if (assessmentDate) {
      params.set('date', assessmentDate);
    } else {
      params.delete('date');
    }
    setSearchParams(params);
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