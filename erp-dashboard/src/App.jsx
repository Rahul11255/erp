import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";

import PurchaseRequests from "./pages/PurchaseRequests";
import ManagePurchaseRequests from "./pages/ManagePurchaseRequests";
import AuditLogs from "./pages/AuditLogs";
import Dashboard from "./pages/Dashboard";

export default function AppRoutes() {

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN ROUTE */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* MAIN ROUTE (NO AUTH CHECK) */}
        <Route
          path="/"
          element={<AppLayout />}
        >
          <Route index element={<Dashboard />} />

          <Route path="create-request" element={<PurchaseRequests />} />

          <Route path="all-requests" element={<ManagePurchaseRequests />} />

          <Route path="audit-logs" element={<AuditLogs />} />
        </Route>

        {/* CATCH ALL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}