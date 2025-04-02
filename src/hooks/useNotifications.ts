import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, addDoc, updateDoc, doc, orderBy } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAppSelector } from '../store'

interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAppSelector((state) => state.auth)

  const fetchNotifications = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      const notificationsRef = collection(db, 'notifications')
      const q = query(
        notificationsRef,
        where('userId', '==', user.id),
        orderBy('createdAt', 'desc')
      )

      const querySnapshot = await getDocs(q)
      const notificationsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[]

      setNotifications(notificationsData)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [user])

  const addNotification = async (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    try {
      setError(null)
      const newNotification = {
        ...notificationData,
        createdAt: new Date().toISOString(),
      }

      const docRef = await addDoc(collection(db, 'notifications'), newNotification)
      const notification = { id: docRef.id, ...newNotification }
      setNotifications((prev) => [notification, ...prev])
      return notification
    } catch (err) {
      setError((err as Error).message)
      throw err
    }
  }

  const markAsRead = async (id: string) => {
    try {
      setError(null)
      const notificationRef = doc(db, 'notifications', id)
      await updateDoc(notificationRef, { read: true })
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      )
    } catch (err) {
      setError((err as Error).message)
      throw err
    }
  }

  const markAllAsRead = async () => {
    try {
      setError(null)
      const unreadNotifications = notifications.filter((n) => !n.read)
      const updatePromises = unreadNotifications.map((notification) =>
        updateDoc(doc(db, 'notifications', notification.id), { read: true })
      )
      await Promise.all(updatePromises)
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      )
    } catch (err) {
      setError((err as Error).message)
      throw err
    }
  }

  const getUnreadCount = () => {
    return notifications.filter((notification) => !notification.read).length
  }

  return {
    notifications,
    loading,
    error,
    addNotification,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    refreshNotifications: fetchNotifications,
  }
} 