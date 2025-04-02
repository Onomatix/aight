// 🔧 AI Context Setup
// This project is a Gas Delivery Service website using React + TypeScript + Tailwind + Recharts.
// It includes Admin and Delivery Personnel roles, reports, analytics, user management, settings, and authentication.
// Use a purple-themed modern UI (minimal, responsive, accessible, clean).
// Goal: Improve UX/UI polish, logic accuracy, state/error handling, and mock/demo data quality.
// Make UI smoother, logic tighter, and UX more intuitive. Use placeholder/mock data if needed.
// Keep everything accessible (keyboard, contrast), responsive, and dark/light mode compatible.
// Assume this is a Vercel-deployed, client-ready SaaS product.

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import { Dashboard } from './pages/Dashboard'
import { UserManagement } from './pages/UserManagement'
import { Reports } from './pages/Reports'
import { Settings } from './pages/Settings'
import { NotFound } from './pages/NotFound'
import { AppDispatch } from './store'

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        path: '',
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <Login />
          },
          {
            path: 'register',
            element: <Register />
          }
        ]
      },
      {
        path: '',
        element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />
          },
          {
            path: 'dashboard',
            element: <Dashboard />
          },
          {
            path: 'users',
            element: <UserManagement />
          },
          {
            path: 'reports',
            element: <Reports />
          },
          {
            path: 'settings',
            element: <Settings />
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
])

function App() {
  const dispatch = useDispatch<AppDispatch>()
  return <RouterProvider router={router} />
}

export default App 