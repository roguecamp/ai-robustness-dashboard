import { PillarCard } from "../PillarCard";
import { Pillar } from "@/types/ratings";
import { useDashboardStore } from "./DashboardState";

interface PillarGridProps {
  pillars: Pillar[];
}

export const PillarGrid = ({ pillars }: PillarGridProps) => {
  const { projectName, assessmentDate, setPillarRatings } = useDashboardStore();

  return (
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
              onUpdate={setPillarRatings}
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
            onUpdate={setPillarRatings}
            projectName={projectName}
            assessmentDate={assessmentDate}
          />
        </div>
      </div>
    </div>
  );
};