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
      { name: "Data Quality", rating: null },
      { name: "Data Governance", rating: null },
      { name: "Data Security", rating: null },
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
      { name: "Access Control", rating: null },
      { name: "Threat Detection", rating: null },
      { name: "Incident Response", rating: null },
    ],
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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