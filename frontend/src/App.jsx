import { Routes, Route, Navigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";

import Hero from "./component/Hero";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProfileForm from "./pages/ProfileForm";

import RecruiterLogin from "./pages/Rlogin";
import RecruiterSignup from "./pages/Rsignup";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import RecruiterFooter from "./pages/Rfooter";

import JobSeekerMessage from "./pages/JobSeekerMessage";
import RecruiterMessage from "./pages/RecruiterMessage";

// ================= RECRUITER PROTECTED =================
function RecruiterProtected({ children }) {
  const token = localStorage.getItem("recruiterToken");

  return token ? children : (
    <Navigate to="/recruiter-login" replace />
  );
}

// ================= JOB SEEKER PROTECTED =================
function JobSeekerProtected({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

function App() {
  const recruiterToken =
    localStorage.getItem(
      "recruiterToken"
    );

  return (
    <Routes>
      {/* HOME */}
      <Route
        path="/"
        element={
          recruiterToken ? (
            <Navigate
              to="/recruiter-dashboard"
              replace
            />
          ) : (
            <>
              <SignedIn>
                <Navigate
                  to="/dashboard"
                  replace
                />
              </SignedIn>

              <SignedOut>
                <Hero />
              </SignedOut>
            </>
          )
        }
      />

      {/* JOB SEEKER */}
      <Route
        path="/login/*"
        element={<Login />}
      />

      <Route
        path="/dashboard"
        element={
          <JobSeekerProtected>
            <Dashboard />
          </JobSeekerProtected>
        }
      />

      <Route
        path="/create-profile"
        element={
          <JobSeekerProtected>
            <ProfileForm />
          </JobSeekerProtected>
        }
      />

      <Route
        path="/jobseeker-messages"
        element={
          <JobSeekerProtected>
            <JobSeekerMessage />
          </JobSeekerProtected>
        }
      />

      {/* RECRUITER */}
      <Route
        path="/recruiter-login"
        element={
          <RecruiterLogin />
        }
      />

      <Route
        path="/recruiter-signup"
        element={
          <RecruiterSignup />
        }
      />

      <Route
        path="/recruiter-dashboard"
        element={
          <RecruiterProtected>
            <>
              <RecruiterDashboard />
              <RecruiterFooter />
            </>
          </RecruiterProtected>
        }
      />

      <Route
        path="/recruiter-messages"
        element={
          <RecruiterProtected>
            <RecruiterMessage />
          </RecruiterProtected>
        }
      />

      {/* FALLBACK */}
      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;