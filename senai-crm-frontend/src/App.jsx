import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Emails from "./pages/Emails";
import EmailDetail from "./pages/EmailDetail";
import Threads from "./pages/Threads";
import Analytics from "./pages/Analytics";
import KnowledgeBase from "./pages/KnowledgeBase"; // <-- ADD THIS

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="emails" element={<Emails />} />
          <Route path="emails/:id" element={<EmailDetail />} />
          <Route path="threads" element={<Threads />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="knowledge" element={<KnowledgeBase />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;