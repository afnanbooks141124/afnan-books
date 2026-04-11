import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ClientCompany from "./Pages/ClientCompany";
import GstManager from "./Pages/GstManager";
import UserRoles from "./pages/UserRoles";
import DataEntry from "./pages/DataEntry";
import LedgerMaster from "./pages/LedgerMaster";
import Banking from "./pages/Banking";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import Analysis from "./Pages/Analysis";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="company" element={<ClientCompany />} />
          <Route path="gst-manager" element={<GstManager />} />
          <Route path="users" element={<UserRoles />} />
          <Route path="data-entry" element={<DataEntry />} />
          <Route path="master" element={<LedgerMaster />} />
          <Route path="banking" element={<Banking />} />
          <Route path="sales" element={<Sales />} />
          <Route path="reports" element={<Reports />} />
          <Route path="analysis" element={<Analysis />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;