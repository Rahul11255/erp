import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";

import { getToken } from "./utils/helperFunction";

import PurchaseRequests from "./pages/PurchaseRequests";
import ManagePurchaseRequests from "./pages/ManagePurchaseRequests";
import AuditLogs from "./pages/AuditLogs";
import Dashboard from "./pages/Dashboard";

export default function AppRoutes() {

  const token = getToken(); // ✅ no useEffect needed

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN ROUTE */}
        <Route
          path="/login"
          element={
            token
              ? <Navigate to="/" replace />
              : <Login />
          }
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            token
              ? <AppLayout />
              : <Navigate to="/login" replace />
          }
        >
          <Route index element={<Dashboard />} />

          <Route path="create-request" element={<PurchaseRequests />} />

          <Route path="all-requests" element={<ManagePurchaseRequests />} />

          <Route path="audit-logs" element={<AuditLogs />} />
        </Route>

        {/* CATCH ALL */}
        <Route
          path="*"
          element={
            <Navigate to={token ? "/" : "/login"} replace />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}