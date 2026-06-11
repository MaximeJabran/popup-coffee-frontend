import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import RegistrationPage from "./pages/registration/RegistrationPage";
import SuccessPage from "./pages/registration/SuccessPage";
import RegistrationClosedPage from "./pages/registration/RegistrationClosedPage";

import MembershipRegistrationPage from "./pages/membership/MembershipRegistrationPage";
import MembershipSuccessPage from "./pages/membership/MembershipSuccessPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";

import { ErrorBoundary } from "./ErrorBoundary";


import "./styles/global.css";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public registration pages */}
          <Route path="/" element={<RegistrationPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/closed" element={<RegistrationClosedPage />} />

          {/* Public membership pages */}
          <Route path="/membership/register" element={<MembershipRegistrationPage />} />
          <Route path="/membership/success" element={<MembershipSuccessPage />} />

          {/* Admin login (public) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin dashboard (protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

