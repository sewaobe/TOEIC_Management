import { Route, Routes, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { RouteWrapper } from "./RouteWrapper";

// Public pages
import AuthPage from "../features/Auth/AuthPage";
import HomePage from "../features/Home/HomePage";

// Layout
import CollaboratorLayout from "../features/Collaborator/CollaboratorLayout";

// ===== Full Test =====
import FullTestPage from "../features/Collaborator/pages/FullTestPage/FullTestPage";
import CreateFullTestPage from "../features/Collaborator/pages/FullTestPage/FullTestCreatePage";
import EditFullTestPage from "../features/Collaborator/pages/FullTestPage/EditFullTestPage";

// ===== Question Bank =====
import QuestionPage from "../features/Collaborator/pages/QuestionPage/QuestionPage";
import CreateQuestionPage from "../features/Collaborator/pages/QuestionPage/CreateQuestionPage";
import EditQuestionPage from "../features/Collaborator/pages/QuestionPage/EditQuestionPage";

// ===== Other pages =====
import DashboardPage from "../features/Collaborator/pages/DashboardPage";
import StudentsPage from "../features/Collaborator/pages/StudentsPage";
import MinitestPage from "../features/Collaborator/pages/MinitestPage";
import GrammarPage from "../features/Collaborator/pages/GrammarPage";
import VocabularyPage from "../features/Vocabulary/VocabularyPage";
import PracticePage from "../features/Collaborator/pages/PracticePage";
import VideoLecturePage from "../features/Collaborator/pages/VideoLecturePage";
import ReportsPage from "../features/Collaborator/pages/ReportsPage";

// Error pages
import NotFound from "../components/NotFound";
import Unauthorized from "../components/Unauthorized";
import ServerError from "../components/ServerError";
import Maintenance from "../components/Maintenance";
import TopicPage from "../features/Collaborator/pages/TopicPage/TopicPage";


export const AppRouter = () => {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Suspense fallback={<div>Loading....</div>}>
        <Routes>
          {/* Public routes */}
          <Route
            path="/auth"
            element={<RouteWrapper element={<AuthPage />} />}
          />
          <Route
            path="/login"
            element={<RouteWrapper element={<AuthPage />} />}
          />

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
          <Route
            path="/ctv"
            element={
              <RouteWrapper
                element={<CollaboratorLayout />}
                requireAuth={true}
                guard={{ role: "collaborator" }}
              />
            }
          >
            {/* ===== Dashboard ===== */}
            <Route path="dashboard" element={<DashboardPage />} />

            {/* ===== Students ===== */}
            <Route path="students" element={<StudentsPage />} />

            {/* ===== Full Test ===== */}
            <Route path="full-tests" element={<FullTestPage />} />
            <Route path="full-tests/create" element={<CreateFullTestPage />} />
            <Route path="full-tests/:id/edit" element={<EditFullTestPage />} />

            {/* ===== Mini Test ===== */}
            <Route path="minitests" element={<MinitestPage />} />
            {/* nếu sau này có Create/Edit thì thêm tương tự */}

            {/* ===== Question Bank ===== */}
            <Route path="questions" element={<QuestionPage />} />
            <Route path="questions/create" element={<CreateQuestionPage />} />
            <Route path="questions/:id/edit" element={<EditQuestionPage />} />

            {/* ===== Grammar ===== */}
            <Route path="grammar" element={<GrammarPage />} />

            {/* ===== Topic ===== */}
            <Route path="topic" element={<TopicPage />} />

            {/* ===== Vocabulary ===== */}
            <Route path="topic/:id/" element={<VocabularyPage />} />

            {/* ===== Practice ===== */}
            <Route path="practice" element={<PracticePage />} />

            {/* ===== Video Lecture ===== */}
            <Route path="video-lectures" element={<VideoLecturePage />} />

            {/* ===== Reports ===== */}
            <Route path="reports" element={<ReportsPage />} />
          </Route>

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
