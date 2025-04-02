import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store'
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} from '../store/slices/authSlice'
import { auth } from '../config/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { User } from '../types'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  )

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          dispatch(loginSuccess(userDoc.data() as User))
        }
      } else {
        dispatch(logout())
      }
    })

    return () => unsubscribe()
  }, [dispatch])

  const login = async (email: string, password: string) => {
    try {
      dispatch(loginStart())
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
      if (userDoc.exists()) {
        dispatch(loginSuccess(userDoc.data() as User))
        navigate('/dashboard')
      }
    } catch (error) {
      dispatch(loginFailure((error as Error).message))
    }
  }

  const register = async (email: string, password: string, userData: Partial<User>) => {
    try {
      dispatch(loginStart())
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const newUser: User = {
        id: userCredential.user.uid,
        email: userCredential.user.email!,
        name: userData.name || '',
        role: userData.role || 'user',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      await setDoc(doc(db, 'users', userCredential.user.uid), newUser)
      dispatch(loginSuccess(newUser))
      navigate('/dashboard')
    } catch (error) {
      dispatch(loginFailure((error as Error).message))
    }
  }

  const logoutUser = async () => {
    try {
      await signOut(auth)
      dispatch(logout())
      navigate('/login')
    } catch (error) {
      dispatch(loginFailure((error as Error).message))
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout: logoutUser,
  }
} 