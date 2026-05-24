import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useEffect, useState } from "react";

import AppLayout from "./layouts/AppLayout";

import Login from "./pages/Login";


import { getToken } from "./utils/helperFunction";
import PurchaseRequests from "./pages/PurchaseRequests";
import ManagePurchaseRequests from "./pages/ManagePurchaseRequests";
import AuditLogs from "./pages/AuditLogs";
import Dashboard from "./pages/Dashboard";

export default function AppRoutes() {

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const storedToken = getToken();
    setToken(storedToken);
    setLoading(false);
  }, []);

  if (loading) {
    return null;
  }

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={
            token
              ? <Navigate to="/" replace />
              : <Login />
          }
        />

        <Route
          path="/"
          element={
            token
              ? <AppLayout />
              : <Navigate to="/login" replace />
          }
        >

          <Route
            index
            element={<Dashboard/>}
          />

          <Route
            path="create-request"
            element={<PurchaseRequests />}
          />

          <Route
            path="all-requests"
            element={<ManagePurchaseRequests />}
          />

          <Route
            path="audit-logs"
            element={<AuditLogs />}
          />

        </Route>
        <Route
          path="*"
          element={
            <Navigate
              to={token ? "/" : "/login"}
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );

}