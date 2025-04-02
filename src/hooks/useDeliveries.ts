import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { Delivery } from '../types'
import { useAppSelector } from '../store'

export const useDeliveries = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAppSelector((state) => state.auth)

  const fetchDeliveries = async () => {
    try {
      setLoading(true)
      setError(null)
      const deliveriesRef = collection(db, 'deliveries')
      let q = query(deliveriesRef)

      if (user?.role === 'driver') {
        q = query(deliveriesRef, where('driverId', '==', user.id))
      }

      const querySnapshot = await getDocs(q)
      const deliveriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Delivery[]

      setDeliveries(deliveriesData)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeliveries()
  }, [user])

  const addDelivery = async (deliveryData: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null)
      const newDelivery = {
        ...deliveryData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const docRef = await addDoc(collection(db, 'deliveries'), newDelivery)
      const delivery = { id: docRef.id, ...newDelivery }
      setDeliveries((prev) => [...prev, delivery])
      return delivery
    } catch (err) {
      setError((err as Error).message)
      throw err
    }
  }

  const updateDelivery = async (id: string, deliveryData: Partial<Delivery>) => {
    try {
      setError(null)
      const deliveryRef = doc(db, 'deliveries', id)
      const updateData = {
        ...deliveryData,
        updatedAt: new Date().toISOString(),
      }

      await updateDoc(deliveryRef, updateData)
      setDeliveries((prev) =>
        prev.map((delivery) =>
          delivery.id === id ? { ...delivery, ...updateData } : delivery
        )
      )
    } catch (err) {
      setError((err as Error).message)
      throw err
    }
  }

  const deleteDelivery = async (id: string) => {
    try {
      setError(null)
      await deleteDoc(doc(db, 'deliveries', id))
      setDeliveries((prev) => prev.filter((delivery) => delivery.id !== id))
    } catch (err) {
      setError((err as Error).message)
      throw err
    }
  }

  const updateDeliveryStatus = async (id: string, status: Delivery['status']) => {
    return updateDelivery(id, { status })
  }

  const updateDeliveryPaymentStatus = async (id: string, paymentStatus: Delivery['paymentStatus']) => {
    return updateDelivery(id, { paymentStatus })
  }

  return {
    deliveries,
    loading,
    error,
    addDelivery,
    updateDelivery,
    deleteDelivery,
    updateDeliveryStatus,
    updateDeliveryPaymentStatus,
    refreshDeliveries: fetchDeliveries,
  }
} 