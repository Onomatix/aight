import { useState, useEffect } from 'react'
import {
  collection,
  query,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  DocumentData,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { Driver, User } from '../types'
import { useAppSelector } from '../store'

export const useDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAppSelector((state) => state.auth)

  const fetchDrivers = async () => {
    try {
      setLoading(true)
      setError(null)
      const driversRef = collection(db, 'drivers')
      const querySnapshot = await getDocs(driversRef)
      const driversData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Driver[]

      setDrivers(driversData)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'manager') {
      fetchDrivers()
    }
  }, [user])

  const addDriver = async (driverData: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null)
      const newDriver = {
        ...driverData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const docRef = await addDoc(collection(db, 'drivers'), newDriver)
      const driver = { id: docRef.id, ...newDriver }
      setDrivers((prev) => [...prev, driver])
      return driver
    } catch (err) {
      setError((err as Error).message)
      throw err
    }
  }

  const updateDriver = async (id: string, driverData: Partial<Driver>) => {
    try {
      setError(null)
      const driverRef = doc(db, 'drivers', id)
      const updateData = {
        ...driverData,
        updatedAt: new Date().toISOString(),
      }

      await updateDoc(driverRef, updateData)
      setDrivers((prev) =>
        prev.map((driver) =>
          driver.id === id ? { ...driver, ...updateData } : driver
        )
      )
    } catch (err) {
      setError((err as Error).message)
      throw err
    }
  }

  const deleteDriver = async (id: string) => {
    try {
      setError(null)
      await deleteDoc(doc(db, 'drivers', id))
      setDrivers((prev) => prev.filter((driver) => driver.id !== id))
    } catch (err) {
      setError((err as Error).message)
      throw err
    }
  }

  const updateDriverStatus = async (id: string, status: Driver['status']) => {
    return updateDriver(id, { status })
  }

  const updateDriverLocation = async (id: string, location: Driver['currentLocation']) => {
    return updateDriver(id, { currentLocation: location })
  }

  const getAvailableDrivers = () => {
    return drivers.filter((driver) => driver.status === 'available')
  }

  const getDriverDetails = async (driverId: string) => {
    try {
      const driverRef = doc(db, 'drivers', driverId)
      const driverDoc = await getDoc(driverRef)
      if (driverDoc.exists()) {
        const driverData = driverDoc.data() as Driver
        const userRef = doc(db, 'users', driverData.userId)
        const userDoc = await getDoc(userRef)
        if (userDoc.exists()) {
          const userData = userDoc.data() as User
          return {
            ...driverData,
            user: userData,
          }
        }
      }
      return null
    } catch (err) {
      setError((err as Error).message)
      return null
    }
  }

  return {
    drivers,
    loading,
    error,
    addDriver,
    updateDriver,
    deleteDriver,
    updateDriverStatus,
    updateDriverLocation,
    getAvailableDrivers,
    getDriverDetails,
    refreshDrivers: fetchDrivers,
  }
} 