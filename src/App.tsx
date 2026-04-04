import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MementoProvider } from "@/context/MementoContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Download from "./pages/Download";
import PatientDashboard from "./pages/PatientDashboard";
import CaregiverDashboard from "./pages/CaregiverDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Accessibility from "./pages/Accessibility";
import NotFound from "./pages/NotFound";

const App = () => (
  <MementoProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/download" element={<Download />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/caregiver-dashboard" element={<CaregiverDashboard />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </MementoProvider>
);

export default App;
