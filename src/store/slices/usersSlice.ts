import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { UserWithoutPassword } from '../../types'
import { mockApi } from '../../services/mockApi'

interface UsersState {
  users: UserWithoutPassword[]
  isLoading: boolean
  error: string | null
}

const initialState: UsersState = {
  users: [],
  isLoading: false,
  error: null
}

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const users = await mockApi.getUsers()
    return users
  }
)

export const createUser = createAsyncThunk(
  'users/createUser',
  async (user: Parameters<typeof mockApi.createUser>[0]) => {
    const newUser = await mockApi.createUser(user)
    return newUser
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch users'
      })
      // Create user
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload)
      })
  }
})

export const { clearError } = usersSlice.actions
export default usersSlice.reducer 