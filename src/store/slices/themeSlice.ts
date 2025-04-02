import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ThemeConfig } from '../../types'

const initialState: ThemeConfig = {
  darkMode: false,
  sidebarCollapsed: false,
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },
  },
})

export const {
  toggleDarkMode,
  setDarkMode,
  toggleSidebar,
  setSidebarCollapsed,
} = themeSlice.actions

export default themeSlice.reducer 