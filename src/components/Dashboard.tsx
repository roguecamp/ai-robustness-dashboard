import { PillarCard } from "./PillarCard";

const pillars = [
  {
    title: "People",
    description: "Team expertise and AI literacy",
    color: "#FF6B6B",
  },
  {
    title: "Strategy",
    description: "AI implementation and business alignment",
    color: "#4ECDC4",
  },
  {
    title: "Data",
    description: "Data quality and management practices",
    color: "#45B7D1",
  },
  {
    title: "Legal",
    description: "Compliance and regulatory adherence",
    color: "#96CEB4",
  },
  {
    title: "Solution",
    description: "AI system effectiveness and reliability",
    color: "#FFEEAD",
  },
  {
    title: "Security",
    description: "System security and risk management",
    color: "#D4A5A5",
  },
];

export const Dashboard = () => {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2 animate-slide-up">
          <h1 className="text-4xl font-bold">AI Robustness Rating</h1>
          <p className="text-gray-500">
            Evaluate your organization's AI implementation across key pillars
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className="animate-scale-in"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <PillarCard {...pillar} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};