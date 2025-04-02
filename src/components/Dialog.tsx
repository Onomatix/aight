import { Fragment } from 'react'
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  confirmText: string
  cancelText: string
  onConfirm: () => void
  variant?: 'default' | 'danger'
  darkMode?: boolean
}

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  variant = 'default',
  darkMode = false
}: DialogProps) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <HeadlessDialog
        as="div"
        className={`fixed z-10 inset-0 overflow-y-auto ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}
        onClose={onClose}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <HeadlessDialog.Overlay className="fixed inset-0 bg-gray-500/30 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className={`inline-block align-bottom rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 backdrop-blur-md ${
              darkMode ? 'bg-gray-800/30 border border-gray-700/50' : 'bg-white/30 border border-gray-200/50'
            }`}>
              <div className="sm:flex sm:items-start">
                {variant === 'danger' && (
                  <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full backdrop-blur-sm ${
                    darkMode ? 'bg-red-900/30 border border-red-700/50' : 'bg-red-100/30 border border-red-200/50'
                  }`}>
                    <ExclamationTriangleIcon className={`h-6 w-6 ${darkMode ? 'text-red-400' : 'text-red-600'}`} aria-hidden="true" />
                  </div>
                )}
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <HeadlessDialog.Title as="h3" className="text-lg leading-6 font-medium">
                    {title}
                  </HeadlessDialog.Title>
                  <div className="mt-2">
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm backdrop-blur-sm ${
                    variant === 'danger'
                      ? darkMode
                        ? 'bg-red-600/80 hover:bg-red-700/80 focus:ring-red-500'
                        : 'bg-red-600/80 hover:bg-red-700/80 focus:ring-red-500'
                      : darkMode
                      ? 'bg-indigo-600/80 hover:bg-indigo-700/80 focus:ring-indigo-500'
                      : 'bg-indigo-600/80 hover:bg-indigo-700/80 focus:ring-indigo-500'
                  }`}
                  onClick={onConfirm}
                >
                  {confirmText}
                </button>
                <button
                  type="button"
                  className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium sm:mt-0 sm:w-auto sm:text-sm backdrop-blur-sm ${
                    darkMode
                      ? 'border-gray-700/50 bg-gray-800/30 text-gray-300 hover:bg-gray-700/30 focus:ring-gray-500'
                      : 'border-gray-200/50 bg-white/30 text-gray-700 hover:bg-gray-50/50 focus:ring-gray-500'
                  }`}
                  onClick={onClose}
                >
                  {cancelText}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </HeadlessDialog>
    </Transition.Root>
  )
} 