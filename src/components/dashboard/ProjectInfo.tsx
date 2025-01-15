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
  const [availableDates, setAvailableDates] = useState<string[]>([]);

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

  useEffect(() => {
    const fetchDates = async () => {
      if (!projectName || projectName === "__new__") {
        setAvailableDates([]);
        return;
      }

      try {
        console.log('Fetching dates for project:', projectName);
        const { data, error } = await supabase
          .from('ratings')
          .select('assessment_date')
          .eq('project_name', projectName)
          .order('assessment_date', { ascending: false });

        if (error) {
          console.error('Error fetching dates:', error);
          toast.error("Failed to load assessment dates");
          throw error;
        }

        // Get unique dates
        const uniqueDates = Array.from(new Set(data.map(row => row.assessment_date)));
        console.log('Found dates:', uniqueDates);
        setAvailableDates(uniqueDates);

        // If there are available dates and no current date is selected, set the most recent one
        if (uniqueDates.length > 0 && (!assessmentDate || !uniqueDates.includes(assessmentDate))) {
          setAssessmentDate(uniqueDates[0]);
        }
      } catch (error) {
        console.error('Error in fetchDates:', error);
      }
    };

    fetchDates();
  }, [projectName, setAssessmentDate]);

  const handleProjectChange = (value: string) => {
    setProjectName(value);
    if (value === "__new__") {
      setAssessmentDate("");
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div>
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
          Project Name (max 20 characters)
        </label>
        <Select value={projectName} onValueChange={handleProjectChange}>
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
        {availableDates.length > 0 && projectName !== "__new__" ? (
          <Select value={assessmentDate} onValueChange={setAssessmentDate}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a date" />
            </SelectTrigger>
            <SelectContent>
              {availableDates.map((date) => (
                <SelectItem key={date} value={date}>
                  {date}
                </SelectItem>
              ))}
              <SelectItem value="__new_date__">New Assessment</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Input
            id="assessmentDate"
            type="date"
            value={assessmentDate}
            onChange={(e) => setAssessmentDate(e.target.value)}
            className="max-w-xs"
          />
        )}
      </div>
    </div>
  );
};