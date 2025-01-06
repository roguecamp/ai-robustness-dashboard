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
      { name: "Training and Upskilling", rating: null },
      { name: "Collaboration", rating: null },
      { name: "Change Management", rating: null },
    ],
  },
  {
    title: "Strategy",
    description: "AI implementation and business alignment",
    color: "#9b87f5",
    keyPractices: [
      { name: "Business Alignment", rating: null },
      { name: "Scalability and Adoption", rating: null },
      { name: "Innovation Framework", rating: null },
    ],
  },
  {
    title: "Data",
    description: "Data quality and management practices",
    color: "#45B7D1",
    keyPractices: [
      { name: "Data Acquisition and Quality", rating: null },
      { name: "Data Governance", rating: null },
      { name: "Data Privacy", rating: null },
    ],
  },
  {
    title: "Legal",
    description: "Compliance and regulatory adherence",
    color: "#96CEB4",
    keyPractices: [
      { name: "Intellectual Property", rating: null },
      { name: "Ethical Considerations", rating: null },
      { name: "Compliance and Regulation", rating: null },
    ],
  },
  {
    title: "Solution",
    description: "AI system effectiveness and reliability",
    color: "#222222",
    keyPractices: [
      { name: "Infrastructure", rating: null },
      { name: "Model Development and Training", rating: null },
      { name: "Deployment and Monitoring", rating: null },
    ],
  },
  {
    title: "Security",
    description: "Horizontal Aspect - System security and risk management",
    color: "#D4A5A5",
    keyPractices: [
      { name: "Training and Awareness", rating: null },
      { name: "Risk Assessment", rating: null },
      { name: "Data Leak Protection", rating: null },
      { name: "Crisis Continuity Planning", rating: null },
      { name: "Intrusion Detection", rating: null },
      { name: "Roles and Responsibilities", rating: null },
      { name: "Investment", rating: null },
      { name: "Access Restriction", rating: null },
      { name: "Contractual Obligations", rating: null },
      { name: "Testing and Validation", rating: null },
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
    setPillarRatings 
  } = useDashboardStore();

  // Initialize state from URL parameters
  useEffect(() => {
    const projectParam = searchParams.get('project');
    const dateParam = searchParams.get('date');
    
    if (projectParam) {
      setProjectName(projectParam);
    }
    
    if (dateParam) {
      setAssessmentDate(dateParam);
    }
  }, []);

  // Load existing ratings from Supabase
  useEffect(() => {
    const loadRatings = async () => {
      if (!projectName || !assessmentDate) return;

      try {
        console.log('Loading ratings for:', projectName, assessmentDate);
        const { data: ratings, error } = await supabase
          .from("ratings")
          .select("*")
          .eq("project_name", projectName)
          .eq("assessment_date", assessmentDate);

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          console.log('Loaded ratings:', ratings);
          // Group ratings by pillar
          const pillarRatingsMap: Record<string, KeyPractice[]> = {};
          
          pillars.forEach(pillar => {
            const pillarRatings = pillar.keyPractices.map(practice => {
              const rating = ratings.find(
                r => r.pillar_title === pillar.title && r.practice_name === practice.name
              );
              return {
                name: practice.name,
                rating: isValidRating(rating?.rating) ? rating.rating : null
              };
            });
            pillarRatingsMap[pillar.title] = pillarRatings;
          });

          console.log('Setting pillar ratings:', pillarRatingsMap);
          setPillarRatings(pillarRatingsMap);
        }
      } catch (error) {
        console.error("Error loading ratings:", error);
        toast.error("Failed to load ratings");
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
    </div>
  );
};
