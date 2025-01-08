import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AspectCard } from "@/components/data-privacy/AspectCard";
import { calculateOverallRating } from "@/utils/dataPrivacyScoring";
import type { DataPrivacyAspect } from "@/types/data-privacy";
import { RatingLevel } from "@/types/ratings";

const initialAspects: DataPrivacyAspect[] = [
  {
    name: "Privacy Policies",
    description: "Established and communicated data privacy policies.",
    rating: null
  },
  {
    name: "Privacy Measures",
    description: "Categorize levels of data privacy.",
    rating: null
  },
  {
    name: "Compliance with Laws",
    description: "Compliance with data protection laws and regulations (e.g., GDPR, CCPA).",
    rating: null
  },
  {
    name: "Data Encryption",
    description: "Encryption of sensitive data both in transit and at rest.",
    rating: null
  },
  {
    name: "Access Controls",
    description: "Role-based access controls to restrict data access.",
    rating: null
  },
  {
    name: "Privacy Auditing",
    description: "Test for or scan potential privacy issues in your data.",
    rating: null
  },
  {
    name: "Incident Response",
    description: "Effective incident response plans for data breaches compromising privacy.",
    rating: null
  }
];

export default function DataPrivacyAspects() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get("project");
  const assessmentDate = searchParams.get("date");
  const [aspects, setAspects] = useState<DataPrivacyAspect[]>(initialAspects);

  useEffect(() => {
    const loadRatings = async () => {
      if (!projectName || !assessmentDate) return;

      try {
        console.log("Loading data privacy ratings for:", projectName, assessmentDate);
        const { data: ratings, error } = await supabase
          .from("ratings")
          .select("*")
          .eq("project_name", projectName)
          .eq("assessment_date", assessmentDate)
          .eq("pillar_title", "Data")
          .like("practice_name", "DataPrivacy:%");

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          console.log("Loaded data privacy ratings:", ratings);
          const savedAspects = [...initialAspects];
          ratings.forEach(rating => {
            const aspectName = rating.practice_name.replace("DataPrivacy:", "");
            const aspectIndex = savedAspects.findIndex(
              aspect => aspect.name === aspectName
            );
            if (aspectIndex !== -1 && rating.rating) {
              savedAspects[aspectIndex].rating = rating.rating as RatingLevel;
            }
          });
          setAspects(savedAspects);
        }
      } catch (error) {
        console.error("Error loading data privacy ratings:", error);
        toast.error("Failed to load ratings");
      }
    };

    loadRatings();
  }, [projectName, assessmentDate]);

  const handleAspectClick = (index: number) => {
    const ratings: RatingLevel[] = [
      "Largely in Place",
      "Somewhat in Place",
      "Not in Place"
    ];
    
    const currentRating = aspects[index].rating;
    const currentIndex = currentRating ? ratings.indexOf(currentRating) : -1;
    const nextRating = ratings[(currentIndex + 1) % ratings.length];
    
    const newAspects = [...aspects];
    newAspects[index] = { ...aspects[index], rating: nextRating };
    setAspects(newAspects);
  };

  const handleSave = async () => {
    if (!projectName || !assessmentDate) {
      toast.error("Project name and assessment date are required");
      return;
    }

    try {
      console.log("Saving data privacy ratings...");
      
      // Save individual aspect ratings
      for (const aspect of aspects) {
        const { error: aspectError } = await supabase
          .from("ratings")
          .upsert({
            project_name: projectName,
            assessment_date: assessmentDate,
            pillar_title: "Data",
            practice_name: `DataPrivacy:${aspect.name}`,
            rating: aspect.rating
          }, {
            onConflict: 'project_name,assessment_date,pillar_title,practice_name'
          });

        if (aspectError) throw aspectError;
      }

      // Calculate and save the overall rating
      const overallRating = calculateOverallRating(aspects);
      
      const { error } = await supabase
        .from("ratings")
        .upsert({
          project_name: projectName,
          assessment_date: assessmentDate,
          pillar_title: "Data",
          practice_name: "Data Privacy",
          rating: overallRating
        }, {
          onConflict: 'project_name,assessment_date,pillar_title,practice_name'
        });

      if (error) throw error;
      
      console.log("Successfully saved data privacy ratings");
      toast.success("Data privacy aspects saved successfully");
      navigate('/');
    } catch (error) {
      console.error("Error saving data privacy ratings:", error);
      toast.error("Failed to save ratings");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Data Privacy Aspects</h1>
            <p className="text-gray-600">
              Rate each aspect of Data Privacy by clicking on the cards. Click multiple times to cycle through ratings.
            </p>
          </div>
          <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
        </div>

        <div className="grid gap-4">
          {aspects.map((aspect, index) => (
            <AspectCard
              key={aspect.name}
              aspect={aspect}
              onClick={() => handleAspectClick(index)}
            />
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Overall Rating</Button>
        </div>
      </div>
    </div>
  );
}