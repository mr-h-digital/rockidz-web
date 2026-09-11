import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ActivityDetail from './pages/ActivityDetail'
import ActivityPlayer from './pages/ActivityPlayer'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Teach from './pages/Teach'
import ActivityBuilder from './pages/ActivityBuilder'
import AdminUsers from './pages/AdminUsers'
import Settings from './pages/Settings'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-[89px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/activities" element={<Catalog />} />
          <Route path="/activities/:slug" element={<ActivityDetail />} />
          <Route
            path="/activities/:slug/play"
            element={
              <ProtectedRoute>
                <ActivityPlayer />
              </ProtectedRoute>
            }
          />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teach"
            element={
              <ProtectedRoute requireEducator>
                <Teach />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teach/:slug"
            element={
              <ProtectedRoute requireEducator>
                <ActivityBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}
