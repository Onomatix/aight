import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  darkMode?: boolean
}

export const Pagination = ({ currentPage, totalPages, onPageChange, darkMode = false }: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const maxVisiblePages = 5
  let visiblePages = pages

  if (totalPages > maxVisiblePages) {
    const start = Math.max(1, Math.min(currentPage - 2, totalPages - maxVisiblePages + 1))
    const end = Math.min(totalPages, start + maxVisiblePages - 1)
    visiblePages = pages.slice(start - 1, end)
  }

  return (
    <nav className="flex items-center justify-between" aria-label="Pagination">
      <div className="flex-1 flex justify-between sm:justify-start">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium backdrop-blur-sm ${
            darkMode
              ? 'border-gray-700/50 bg-gray-800/30 text-gray-300 hover:bg-gray-700/30 disabled:opacity-50 disabled:cursor-not-allowed'
              : 'border-gray-200/50 bg-white/30 text-gray-500 hover:bg-gray-50/50 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium backdrop-blur-sm ${
              page === currentPage
                ? darkMode
                  ? 'z-10 bg-indigo-600/30 border-indigo-600/50 text-white'
                  : 'z-10 bg-indigo-50/30 border-indigo-500/50 text-indigo-600'
                : darkMode
                ? 'border-gray-700/50 bg-gray-800/30 text-gray-300 hover:bg-gray-700/30'
                : 'border-gray-200/50 bg-white/30 text-gray-500 hover:bg-gray-50/50'
            }`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium backdrop-blur-sm ${
            darkMode
              ? 'border-gray-700/50 bg-gray-800/30 text-gray-300 hover:bg-gray-700/30 disabled:opacity-50 disabled:cursor-not-allowed'
              : 'border-gray-200/50 bg-white/30 text-gray-500 hover:bg-gray-50/50 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
          aria-label="Next page"
        >
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
} 