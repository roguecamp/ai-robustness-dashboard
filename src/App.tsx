import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import InfrastructureAspects from "./pages/InfrastructureAspects";
import IntellectualPropertyAspects from "./pages/IntellectualPropertyAspects";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/infrastructure-aspects" element={<InfrastructureAspects />} />
      <Route path="/intellectual-property-aspects" element={<IntellectualPropertyAspects />} />
    </Routes>
  );
}

export default App;
