import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserProfile {
  id: string
  email: string
  displayName: string
  role: 'admin' | 'delivery' | 'user'
  status: 'active' | 'inactive'
  createdAt: string
  lastLogin: string
}

interface UserState {
  users: UserProfile[]
  selectedUser: UserProfile | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<UserProfile[]>) => {
      state.users = action.payload
      state.loading = false
      state.error = null
    },
    setSelectedUser: (state, action: PayloadAction<UserProfile | null>) => {
      state.selectedUser = action.payload
    },
    addUser: (state, action: PayloadAction<UserProfile>) => {
      state.users.push(action.payload)
    },
    updateUser: (state, action: PayloadAction<UserProfile>) => {
      const index = state.users.findIndex(user => user.id === action.payload.id)
      if (index !== -1) {
        state.users[index] = action.payload
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(user => user.id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const {
  setUsers,
  setSelectedUser,
  addUser,
  updateUser,
  deleteUser,
  setLoading,
  setError,
} = userSlice.actions

export default userSlice.reducer 