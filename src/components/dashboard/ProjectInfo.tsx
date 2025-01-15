import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [existingProjects, setExistingProjects] = useState<string[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('Fetching existing projects...');
        const { data, error } = await supabase
          .from('ratings')
          .select('project_name')
          .order('project_name');

        if (error) {
          console.error('Error fetching projects:', error);
          toast.error("Failed to load existing projects");
          throw error;
        }

        // Get unique project names
        const uniqueProjects = Array.from(new Set(data.map(row => row.project_name)));
        console.log('Found projects:', uniqueProjects);
        setExistingProjects(uniqueProjects);
      } catch (error) {
        console.error('Error in fetchProjects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="mt-4 space-y-4">
      <div>
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
          Project Name (max 20 characters)
        </label>
        <Select value={projectName} onValueChange={setProjectName}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {existingProjects.map((project) => (
              <SelectItem key={project} value={project}>
                {project}
              </SelectItem>
            ))}
            <SelectItem value="__new__">New Project</SelectItem>
          </SelectContent>
        </Select>
        {(projectName === "__new__" || !existingProjects.includes(projectName)) && (
          <Input
            id="projectName"
            type="text"
            maxLength={20}
            value={projectName === "__new__" ? "" : projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="max-w-xs mt-2"
            placeholder="Enter new project name"
          />
        )}
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