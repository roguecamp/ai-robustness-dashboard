import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface ProjectInfoProps {
  projectName: string;
  setProjectName: (name: string) => void;
  assessmentDate: string;
  setAssessmentDate: (date: string) => void;
}

export const ProjectInfo = ({
  projectName,
  setProjectName,
  assessmentDate,
  setAssessmentDate,
}: ProjectInfoProps) => {
  return (
    <div className="mt-4 space-y-4">
      <div>
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
          Project Name (max 20 characters)
        </label>
        <Input
          id="projectName"
          type="text"
          maxLength={20}
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="max-w-xs"
          placeholder="Enter project name"
        />
      </div>
      <div>
        <label htmlFor="assessmentDate" className="block text-sm font-medium text-gray-700 mb-1">
          Assessment Date
        </label>
        <Input
          id="assessmentDate"
          type="date"
          value={assessmentDate}
          onChange={(e) => setAssessmentDate(e.target.value)}
          className="max-w-xs"
        />
      </div>
    </div>
  );
};