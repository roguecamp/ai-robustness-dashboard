import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TrainingAspects from "./pages/TrainingAspects";
import CollaborationAspects from "./pages/CollaborationAspects";
import ChangeManagementAspects from "./pages/ChangeManagementAspects";
import BusinessAlignmentAspects from "./pages/BusinessAlignmentAspects";
import ScalabilityAspects from "./pages/ScalabilityAspects";
import InnovationAspects from "./pages/InnovationAspects";
import DataAcquisitionAspects from "./pages/DataAcquisitionAspects";
import DataGovernanceAspects from "./pages/DataGovernanceAspects";
import DataPrivacyAspects from "./pages/DataPrivacyAspects";
import IntellectualPropertyAspects from "./pages/IntellectualPropertyAspects";
import EthicalConsiderationsAspects from "./pages/EthicalConsiderationsAspects";
import ComplianceRegulationAspects from "./pages/ComplianceRegulationAspects";
import InfrastructureAspects from "./pages/InfrastructureAspects";
import ModelDevelopmentAspects from "./pages/ModelDevelopmentAspects";
import DeploymentMonitoringAspects from "./pages/DeploymentMonitoringAspects";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/training-aspects" element={<TrainingAspects />} />
          <Route path="/collaboration-aspects" element={<CollaborationAspects />} />
          <Route path="/change-management-aspects" element={<ChangeManagementAspects />} />
          <Route path="/business-alignment-aspects" element={<BusinessAlignmentAspects />} />
          <Route path="/scalability-aspects" element={<ScalabilityAspects />} />
          <Route path="/innovation-aspects" element={<InnovationAspects />} />
          <Route path="/data-acquisition-aspects" element={<DataAcquisitionAspects />} />
          <Route path="/data-governance-aspects" element={<DataGovernanceAspects />} />
          <Route path="/data-privacy-aspects" element={<DataPrivacyAspects />} />
          <Route path="/intellectual-property-aspects" element={<IntellectualPropertyAspects />} />
          <Route path="/ethical-considerations-aspects" element={<EthicalConsiderationsAspects />} />
          <Route path="/compliance-regulation-aspects" element={<ComplianceRegulationAspects />} />
          <Route path="/infrastructure-aspects" element={<InfrastructureAspects />} />
          <Route path="/model-development-aspects" element={<ModelDevelopmentAspects />} />
          <Route path="/deployment-monitoring-aspects" element={<DeploymentMonitoringAspects />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;