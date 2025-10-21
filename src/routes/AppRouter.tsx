import { Route, Routes, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { RouteWrapper } from "./RouteWrapper";

// Public pages
import AuthPage from "../features/Auth/AuthPage";
// Layout
import CollaboratorLayout from "../features/Collaborator/CollaboratorLayout";

// ===== Full Test =====
import FullTestPage from "../features/Collaborator/pages/FullTestPage/FullTestPage";
import CreateFullTestPage from "../features/Collaborator/pages/FullTestPage/FullTestCreatePage";
import EditFullTestPage from "../features/Collaborator/pages/FullTestPage/EditFullTestPage";
import DetailFullTestPage from "../features/Collaborator/pages/FullTestPage/FullTestDetailPage/index";

// ===== Question Bank =====
import QuestionPage from "../features/Collaborator/pages/QuestionPage/QuestionPage";
import CreateQuestionPage from "../features/Collaborator/pages/QuestionPage/CreateQuestionPage";
import EditQuestionPage from "../features/Collaborator/pages/QuestionPage/EditQuestionPage";

// ===== Other pages =====
import StudentsPage from "../features/Collaborator/pages/StudentsPage/index";
import MinitestPage from "../features/Collaborator/pages/MinitestPage";
import GrammarPage from "../features/Grammar/GrammarPage";
import VocabularyPage from "../features/Vocabulary/VocabularyPage";

import QuizListPage from "../features/Collaborator/pages/QuizPage/QuizListPage";
import CreateQuizPage from "../features/Collaborator/pages/QuizPage/CreateQuizPage";
import EditQuizPage from "../features/Collaborator/pages/QuizPage/EditQuizPage";
import QuizDetailPage from "../features/Collaborator/pages/QuizPage/QuizDetailPage";

import VideoLecturePage from "../features/Collaborator/pages/VideoLecturePage/VideoLecturePage";

// Error pages
import NotFound from "../components/NotFound";
import Unauthorized from "../components/Unauthorized";
import ServerError from "../components/ServerError";
import Maintenance from "../components/Maintenance";
import TopicPage from "../features/Collaborator/pages/TopicPage/TopicPage";
import LandingPage from "../features/LandingPage/LandingPage";
import DashboardPage from "../features/Dashboard/DashboardPage";
import ReportsPage from "../features/Reports/ReportsPage";
import CommentPage from "../features/Comment/CommentPage";
import LessonManager from "../features/Grammar/LessonManager";
import DictationPage from "../features/Dictation/DictationPage";
import ShadowingPage from "../features/Shadowing/ShadowingPage";
import LessonManagerPage from "../features/LessonManager/LessonManagerPage";
import LessonManagerDetailPage from "../features/LessonManager/LessonManagerDetailPage";

export const AppRouter = () => {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Suspense fallback={<div>Loading....</div>}>
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={<RouteWrapper element={<LandingPage />} />}
          />

          <Route
            path="/auth"
            element={<RouteWrapper element={<AuthPage />} />}
          />

          {/* Private route - cộng tác viên */}
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
            <Route
              path="full-tests/:id/detail"
              element={<DetailFullTestPage />}
            />

            {/* ===== Mini Test ===== */}
            <Route path="minitests" element={<MinitestPage />} />
            {/* nếu sau này có Create/Edit thì thêm tương tự */}

            {/* ===== Question Bank ===== */}
            <Route path="questions" element={<QuestionPage />} />
            <Route path="questions/create" element={<CreateQuestionPage />} />
            <Route
              path="questions/:groupId/edit"
              element={<EditQuestionPage />}
            />

            {/* ===== LessonManager ===== */}
            <Route path="integrated-lessons" element={<LessonManagerPage />} />
            <Route
              path="integrated-lessons/:id"
              element={<LessonManagerDetailPage />}
            />

            {/* ===== Grammar ===== */}
            <Route path="grammar" element={<GrammarPage />} />
            <Route path="grammar/:id" element={<LessonManager />} />

            {/* ===== Topic ===== */}
            <Route path="topics" element={<TopicPage />} />

            {/* ===== Vocabulary ===== */}
            <Route path="topics/:id/" element={<VocabularyPage />} />

            {/* ===== Practice ===== */}
            <Route path="practice" element={<QuizListPage />} />
            <Route path="quiz" element={<QuizListPage />} />
            <Route path="quiz/create" element={<CreateQuizPage />} />
            <Route path="quiz/edit/:id" element={<EditQuizPage />} />
            <Route path="quiz/:id/detail" element={<QuizDetailPage />} />

            <Route path="dictation" element={<DictationPage />} />
            <Route path="shadowing" element={<ShadowingPage />} />

            {/* ===== Video Lecture ===== */}
            <Route path="video-lectures" element={<VideoLecturePage />} />

            {/* ===== Reports ===== */}
            <Route path="reports" element={<ReportsPage />} />
            <Route path="report/error" element={<div> Report error </div>} />
            <Route path="report/comment" element={<CommentPage />} />
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
