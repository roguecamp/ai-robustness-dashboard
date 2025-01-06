import { PillarCard } from "../PillarCard";
import { Pillar } from "@/types/ratings";
import { useDashboardStore } from "./DashboardState";

interface PillarGridProps {
  pillars: Pillar[];
}

export const PillarGrid = ({ pillars }: PillarGridProps) => {
  const { projectName, assessmentDate, pillarRatings, setPillarRatings } = useDashboardStore();

  // Convert pillarRatings to the format expected by PillarCard
  const convertRatings = (ratings: Record<string, { name: string; rating: string | null }[]>): Record<string, string | null> => {
    const result: Record<string, string | null> = {};
    Object.values(ratings).flat().forEach(practice => {
      result[practice.name] = practice.rating;
    });
    return result;
  };

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
              onUpdate={(ratings) => {
                const newRatings = Object.entries(ratings).reduce((acc, [name, rating]) => {
                  acc[pillar.title] = pillar.keyPractices.map(practice => ({
                    name: practice.name,
                    rating: practice.name === name ? rating : practice.rating
                  }));
                  return acc;
                }, {} as Record<string, { name: string; rating: string | null }[]>);
                setPillarRatings(newRatings);
              }}
              projectName={projectName}
              assessmentDate={assessmentDate}
              currentRatings={convertRatings(pillarRatings)}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6">
        <div className="animate-scale-in" style={{ animationDelay: '500ms' }}>
          <PillarCard 
            {...pillars[5]} 
            onUpdate={(ratings) => {
              const newRatings = Object.entries(ratings).reduce((acc, [name, rating]) => {
                acc[pillars[5].title] = pillars[5].keyPractices.map(practice => ({
                  name: practice.name,
                  rating: practice.name === name ? rating : practice.rating
                }));
                return acc;
              }, {} as Record<string, { name: string; rating: string | null }[]>);
              setPillarRatings(newRatings);
            }}
            projectName={projectName}
            assessmentDate={assessmentDate}
            currentRatings={convertRatings(pillarRatings)}
          />
        </div>
      </div>
    </div>
  );
};