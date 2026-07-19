import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import MissionControl from './pages/MissionControl';
import FanCopilot from './pages/FanCopilot';
import IncidentWorkflow from './pages/IncidentWorkflow';
import ScenarioSimulator from './pages/ScenarioSimulator';
import ExecutiveBriefing from './pages/ExecutiveBriefing';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/mission-control" element={<MissionControl />} />
        <Route path="/copilot" element={<FanCopilot />} />
        <Route path="/incident" element={<IncidentWorkflow />} />
        <Route path="/simulator" element={<ScenarioSimulator />} />
        <Route path="/briefing" element={<ExecutiveBriefing />} />
      </Routes>
    </BrowserRouter>
  );
}
