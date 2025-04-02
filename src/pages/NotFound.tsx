import { Link } from 'react-router-dom'

export const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-extrabold text-primary-500">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="btn btn-primary"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  )
} 