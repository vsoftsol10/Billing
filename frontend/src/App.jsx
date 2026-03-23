import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './component/common/login';
import SignUp from './component/common/signUp';
import ForgotPassword from './component/common/forgotPassword';

// Placeholder pages — replace with your actual components
const Dashboard = () => <div className="p-8 text-xl font-bold">Dashboard (Coming Soon)</div>
const Register = () => <div className="p-8 text-xl font-bold">Register (Coming Soon)</div>

// Simple auth guard — replace with your actual auth logic (context/redux/jwt check)
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App