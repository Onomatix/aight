import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import {
  toggleDarkMode,
  setDarkMode,
  toggleSidebar,
  setSidebarCollapsed,
} from '../store/slices/themeSlice'

export const useTheme = () => {
  const dispatch = useAppDispatch()
  const { darkMode, sidebarCollapsed } = useAppSelector((state) => state.theme)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkModeHandler = () => {
    dispatch(toggleDarkMode())
  }

  const setDarkModeHandler = (value: boolean) => {
    dispatch(setDarkMode(value))
  }

  const toggleSidebarHandler = () => {
    dispatch(toggleSidebar())
  }

  const setSidebarCollapsedHandler = (value: boolean) => {
    dispatch(setSidebarCollapsed(value))
  }

  return {
    darkMode,
    sidebarCollapsed,
    toggleDarkMode: toggleDarkModeHandler,
    setDarkMode: setDarkModeHandler,
    toggleSidebar: toggleSidebarHandler,
    setSidebarCollapsed: setSidebarCollapsedHandler,
  }
} 