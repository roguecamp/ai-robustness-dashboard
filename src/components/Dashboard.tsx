import { useState, useEffect } from "react";
import { PillarCard } from "./PillarCard";
import type { Pillar } from "@/types/ratings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { ProjectInfo } from "./dashboard/ProjectInfo";
import { RatingKey } from "./dashboard/RatingKey";
import { useNavigate, useLocation } from "react-router-dom";

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
    description: "System security and risk management",
    color: "#D4A5A5",
    keyPractices: [
      { name: "Training and Awareness", rating: null },
      { name: "Roles and Responsibilities", rating: null },
      { name: "Risk Assessment", rating: null },
      { name: "Investment", rating: null },
      { name: "Data Leak Protection", rating: null },
      { name: "Access Restriction", rating: null },
      { name: "Crisis Continuity Planning", rating: null },
      { name: "Contractual Obligations", rating: null },
      { name: "Intrusion Detection", rating: null },
      { name: "Testing and Validation", rating: null },
    ],
  },
];

export const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [projectName, setProjectName] = useState(queryParams.get('project') || "");
  const [assessmentDate, setAssessmentDate] = useState(queryParams.get('date') || format(new Date(), "yyyy-MM-dd"));
  const [pillarRatings, setPillarRatings] = useState<Record<string, { name: string; rating: string | null }[]>>({});

  // Update URL when project name or date changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (projectName) params.set('project', projectName);
    if (assessmentDate) params.set('date', assessmentDate);
    navigate(`?${params.toString()}`, { replace: true });
  }, [projectName, assessmentDate, navigate]);

  const handleUpdateRatings = (pillarTitle: string, practices: { name: string; rating: string | null }[]) => {
    setPillarRatings(prev => ({
      ...prev,
      [pillarTitle]: practices
    }));
  };

  const handleSaveAllRatings = async () => {
    try {
      const allPromises: Promise<any>[] = [];
      
      Object.entries(pillarRatings).forEach(([pillarTitle, practices]) => {
        practices.forEach(async (practice) => {
          const promise = new Promise(async (resolve, reject) => {
            const { data, error } = await supabase
              .from("ratings")
              .upsert({
                project_name: projectName,
                assessment_date: assessmentDate,
                pillar_title: pillarTitle,
                practice_name: practice.name,
                rating: practice.rating
              }, {
                onConflict: 'project_name,assessment_date,pillar_title,practice_name'
              })
              .select();

            if (error) reject(error);
            else resolve(data);
          });
            
          allPromises.push(promise);
        });
      });
      
      await Promise.all(allPromises);
      toast.success("Successfully saved all ratings");
    } catch (error) {
      console.error("Error saving ratings:", error);
      toast.error("Failed to save ratings");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold">AI Robustness Rating</h1>
            <p className="text-gray-500">
              Evaluate your organization's AI implementation across key pillars
            </p>
            <ProjectInfo
              projectName={projectName}
              setProjectName={setProjectName}
              assessmentDate={assessmentDate}
              setAssessmentDate={setAssessmentDate}
            />
          </div>
          <RatingKey />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {pillars.slice(0, 5).map((pillar, index) => (
              <div
                key={pillar.title}
                className="animate-scale-in"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <PillarCard 
                  {...pillar} 
                  onUpdate={handleUpdateRatings}
                  projectName={projectName}
                  assessmentDate={assessmentDate}
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="animate-scale-in" style={{ animationDelay: '500ms' }}>
              <PillarCard 
                {...pillars[5]} 
                onUpdate={handleUpdateRatings}
                projectName={projectName}
                assessmentDate={assessmentDate}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <Button 
            onClick={handleSaveAllRatings}
            className="px-8"
            size="lg"
          >
            Save All Ratings
          </Button>
        </div>
      </div>
    </div>
  );
};