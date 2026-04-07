import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './component/common/login';
import SignUp from './component/common/signUp';
import ForgotPassword from './component/common/forgotPassword';
import DashboardPage from './pages/Dashboard';
import Invoice from './pages/Invoice';
import Quotation from './pages/Quotation';
import Purchase from './pages/Purchase';

// Simple auth guard — replace with your actual auth logic (context/redux/jwt check)
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/" replace />
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
              <DashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/invoice"
          element={
            <PrivateRoute>
              <Invoice />
            </PrivateRoute>
          }
        />

        <Route
          path="/quotation"
          element={
            <PrivateRoute>
              <Quotation />
            </PrivateRoute>
          }
        />

        <Route
          path="/purchase"
          element={
            <PrivateRoute>
              <Purchase />
            </PrivateRoute>
          }
        />

          </Routes>
    </Router>
  )
}

export default App