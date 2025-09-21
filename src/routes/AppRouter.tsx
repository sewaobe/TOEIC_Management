import { Route, Routes, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { RouteWrapper } from "./RouteWrapper";
import AuthPage from "../features/Auth/AuthPage";
import HomePage from "../features/Home/HomePage";
import NotFound from "../components/NotFound";
import Unauthorized from "../components/Unauthorized";
import ServerError from "../components/ServerError";
import Maintenance from "../components/Maintenance";

export const AppRouter = () => {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Suspense fallback={<div>Loading....</div>}>
        <Routes>
          {/* Public routes */}
          <Route path="/auth" element={<RouteWrapper element={<AuthPage />} />} />
          <Route path="/login" element={<RouteWrapper element={<AuthPage />} />} />

          {/* Private route - cộng tác viên */}
          <Route
            path="/home"
            element={
              <RouteWrapper
                element={<HomePage />}
                requireAuth={true}
                guard={{ role: "collaborator" }}
              />
            }
          />

          {/* Private route - admin */}
          {/* <Route
            path="/admin"
            element={
              <RouteWrapper
                element={<Dashboard />}
                guard={{ role: "admin" }}
              />
            }
          /> */}

          {/* 401 redirect */}
          <Route path="/401" element={<Unauthorized />} />
          {/* 404 redirect */}
          <Route path="/404" element={<NotFound />} />
          {/* 500 redirect */}
          <Route path="/500" element={<ServerError />} />
          {/* Maintenance redirect */}
          <Route path="/maintenance" element={<Maintenance />} />
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Suspense>
    </>
  );
};
