// 📁 File: src/App.tsx
import { Route, Routes, Navigate } from "react-router-dom"
import Dashboard from "./pages/Dashboard" 
import ActivityLog from "./pages/ActivityLog"
import Login from "./pages/Login"
import Signup from "./pages/Signup" 
import Profile from "./pages/Profile"
import AiAssistant from "./pages/AiAssistant"
import Onboarding from "./pages/Onboarding"
import Layout from "./pages/Layout"
import Home from "./pages/Home" 
import { useAppContext } from "./context/Appcontext"

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

/**
 * 🔒 Route Guard Component
 * Handles layout permissions explicitly based on onboarding status
 */
const ProtectedAppFlow = () => {
  const { user, onboardingCompleted } = useAppContext()

  // Guard 1: If somehow not logged in, boot back to home
  if (!user) return <Navigate to="/" replace />

  // Guard 2: If logged in but onboarding is incomplete, isolate them to the onboarding view
  if (!onboardingCompleted) return <Navigate to="/onboarding" replace />

  // Guard 3: Fully verified user -> serve the inner app workspace shell layout
  return <Layout />
}

const App = () => {
  const { user, isUserFetched, onboardingCompleted } = useAppContext()

  // Prevent app jumpiness while localStorage token is initializing
  if (!isUserFetched) {
    return (
      <div className="flex items-center justify-center h-screen font-sans text-xl font-bold tracking-wide transition-colors text-sky-500 bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <span className="w-10 h-10 border-4 rounded-full border-t-transparent border-sky-500 animate-spin"></span>
          <span>Loading central profile...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <Routes>
        {/* 1. PUBLIC LANDING ROUTE */}
        <Route path="/" element={<Home />} />
        
        {/* 2. AUTHENTICATION GATES */}
        <Route 
          path="/login" 
          element={
            user ? (
              <Navigate to={onboardingCompleted ? "/dashboard" : "/onboarding"} replace />
            ) : (
              <Login />
            )
          } 
        />
        <Route 
          path="/signup" 
          element={
            user ? (
              <Navigate to={onboardingCompleted ? "/dashboard" : "/onboarding"} replace />
            ) : (
              <Signup />
            )
          } 
        />

        {/* 3. ISOLATED ONBOARDING GATE */}
        <Route 
          path="/onboarding" 
          element={
            user ? (
              onboardingCompleted ? <Navigate to="/dashboard" replace /> : <Onboarding />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* 4. PROTECTED APP FLOW WORKSPACE */}
        <Route element={<ProtectedAppFlow />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/activityLog" element={<ActivityLog />} />
          <Route path="/aiPlanner" element={<AiAssistant />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        
        {/* 5. CATCH-ALL ROUTE RUNTIME FALLBACK */}
        <Route 
          path="*" 
          element={
            user ? (
              <Navigate to={onboardingCompleted ? "/dashboard" : "/onboarding"} replace />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>

      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        theme="dark" 
      />
    </>
  )
}

export default App