import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@store/index'
import { setDarkMode } from '@store/slices/themeSlice'
import { toast } from 'react-hot-toast'

interface SettingsSection {
  id: string
  name: string
  description: string
}

const sections: SettingsSection[] = [
  {
    id: 'general',
    name: 'General',
    description: 'Basic settings for your account and application preferences.',
  },
  {
    id: 'appearance',
    name: 'Appearance',
    description: 'Customize the look and feel of the application.',
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Configure how you receive notifications.',
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Manage your security preferences and authentication settings.',
  },
]

export const Settings = () => {
  const [activeSection, setActiveSection] = useState('general')
  const dispatch = useDispatch()
  const darkMode = useSelector((state: RootState) => state.theme.darkMode)

  const handleThemeChange = (isDark: boolean) => {
    dispatch(setDarkMode(isDark))
    toast.success(`Theme changed to ${isDark ? 'dark' : 'light'} mode`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <nav className="col-span-12 lg:col-span-3">
          <ul role="list" className="space-y-1">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                    activeSection === section.id
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-12 lg:col-span-9">
          <div className="card p-6">
            {activeSection === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Company Information
                  </h3>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="companyName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Company name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="companyName"
                          id="companyName"
                          className="input"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="website"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Website
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="website"
                          id="website"
                          className="input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Theme
                  </h3>
                  <div className="mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          id="light"
                          name="theme"
                          type="radio"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                          checked={!darkMode}
                          onChange={() => handleThemeChange(false)}
                        />
                        <label
                          htmlFor="light"
                          className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Light mode
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="dark"
                          name="theme"
                          type="radio"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                          checked={darkMode}
                          onChange={() => handleThemeChange(true)}
                        />
                        <label
                          htmlFor="dark"
                          className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Dark mode
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Email Notifications
                  </h3>
                  <div className="mt-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id="comments"
                            name="comments"
                            type="checkbox"
                            className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
                          />
                        </div>
                        <div className="ml-3">
                          <label
                            htmlFor="comments"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            New delivery requests
                          </label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Get notified when a new delivery request is created.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Password
                  </h3>
                  <div className="mt-6">
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="currentPassword"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Current password
                        </label>
                        <div className="mt-1">
                          <input
                            type="password"
                            name="currentPassword"
                            id="currentPassword"
                            className="input"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="newPassword"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          New password
                        </label>
                        <div className="mt-1">
                          <input
                            type="password"
                            name="newPassword"
                            id="newPassword"
                            className="input"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Confirm new password
                        </label>
                        <div className="mt-1">
                          <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            className="input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 