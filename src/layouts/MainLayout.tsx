import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { setDarkMode } from '../store/slices/themeSlice'
import { Sidebar } from '../components/Sidebar'
import { Header } from '../components/Header'

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const dispatch = useDispatch()
  const darkMode = useSelector((state: RootState) => state.theme.darkMode)

  const toggleTheme = () => {
    dispatch(setDarkMode(!darkMode))
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex flex-1 flex-col">
        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          theme={darkMode ? 'dark' : 'light'}
          onThemeToggle={toggleTheme}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
} 