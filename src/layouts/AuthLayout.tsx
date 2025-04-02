import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@store/index'

export const AuthLayout = () => {
  const location = useLocation()
  const user = useSelector((state: RootState) => state.auth.user)
  const from = location.state?.from?.pathname || '/dashboard'

  if (user) {
    return <Navigate to={from} replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img
            className="mx-auto h-12 w-auto"
            src="/aight-logo.svg"
            alt="Aight Gas"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome to Aight Gas
          </h2>
        </div>
        
        <Outlet />
      </div>
    </div>
  )
} 