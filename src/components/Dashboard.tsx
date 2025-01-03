import { PillarCard } from "./PillarCard";
import type { Pillar } from "@/types/ratings";

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
      { name: "Regulatory Compliance", rating: null },
      { name: "Risk Management", rating: null },
      { name: "Privacy Protection", rating: null },
    ],
  },
  {
    title: "Solution",
    description: "AI system effectiveness and reliability",
    color: "#222222",
    keyPractices: [
      { name: "System Performance", rating: null },
      { name: "Reliability", rating: null },
      { name: "Maintainability", rating: null },
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
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="relative">
          <div className="text-center space-y-2 animate-slide-up">
            <h1 className="text-4xl font-bold">AI Robustness Rating</h1>
            <p className="text-gray-500">
              Evaluate your organization's AI implementation across key pillars
            </p>
          </div>
          
          {/* Rating Key */}
          <div className="absolute top-0 right-0 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-sm font-medium mb-2">Rating Key</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-700"></div>
                <span className="text-sm">Largely in Place</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-300"></div>
                <span className="text-sm">Somewhat in Place</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white border border-gray-200"></div>
                <span className="text-sm">Not in Place</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* First row with 5 pillars */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {pillars.slice(0, 5).map((pillar, index) => (
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
          {/* Second row with Security pillar */}
          <div className="grid grid-cols-1 gap-6">
            <div className="animate-scale-in" style={{ animationDelay: '500ms' }}>
              <PillarCard {...pillars[5]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};