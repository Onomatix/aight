import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { User, UserWithoutPassword } from '../../types'
import { mockApi } from '../../services/mockApi'

interface AuthState {
  user: UserWithoutPassword | null
  token: string | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const user = await mockApi.login(credentials.email, credentials.password)
    if (!user) {
      throw new Error('Invalid credentials')
    }
    // In a real app, you would get a token from the server
    const token = 'mock-token-' + Date.now()
    return { user, token }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  // In a real app, you would call the server to invalidate the token
  return null
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Login failed'
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
      })
  }
})

export const { clearError } = authSlice.actions
export default authSlice.reducer 