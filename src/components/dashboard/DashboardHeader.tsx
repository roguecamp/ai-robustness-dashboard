import { ProjectInfo } from "./ProjectInfo";
import { RatingKey } from "./RatingKey";
import { useDashboardStore } from "./DashboardState";

export const DashboardHeader = () => {
  const { 
    projectName, 
    assessmentDate, 
    setProjectName, 
    setAssessmentDate 
  } = useDashboardStore();

  return (
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
  );
};