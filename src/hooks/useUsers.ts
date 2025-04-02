import { useState, useEffect } from 'react'
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { User } from '../types'
import { useAppSelector } from '../store'

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user: currentUser } = useAppSelector((state) => state.auth)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const usersRef = collection(db, 'users')
      const querySnapshot = await getDocs(usersRef)
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[]

      setUsers(usersData)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'manager') {
      fetchUsers()
    }
  }, [currentUser])

  const addUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null)
      const newUser = {
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const docRef = await addDoc(collection(db, 'users'), newUser)
      const user = { id: docRef.id, ...newUser }
      setUsers((prev) => [...prev, user])
      return user
    } catch (err) {
      setError((err as Error).message)
      throw err
    }
  }

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      setError(null)
      const userRef = doc(db, 'users', id)
      const updateData = {
        ...userData,
        updatedAt: new Date().toISOString(),
      }

      await updateDoc(userRef, updateData)
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, ...updateData } : user
        )
      )
    } catch (err) {
      setError((err as Error).message)
      throw err
    }
  }

  const deleteUser = async (id: string) => {
    try {
      setError(null)
      await deleteDoc(doc(db, 'users', id))
      setUsers((prev) => prev.filter((user) => user.id !== id))
    } catch (err) {
      setError((err as Error).message)
      throw err
    }
  }

  const updateUserStatus = async (id: string, status: User['status']) => {
    return updateUser(id, { status })
  }

  const updateUserRole = async (id: string, role: User['role']) => {
    return updateUser(id, { role })
  }

  return {
    users,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    updateUserStatus,
    updateUserRole,
    refreshUsers: fetchUsers,
  }
} 