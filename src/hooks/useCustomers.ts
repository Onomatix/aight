import { useState, useEffect } from 'react'
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { Customer } from '../types'
import { useAppSelector } from '../store'

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAppSelector((state) => state.auth)

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      const customersRef = collection(db, 'customers')
      const querySnapshot = await getDocs(customersRef)
      const customersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Customer[]

      setCustomers(customersData)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'manager') {
      fetchCustomers()
    }
  }, [user])

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null)
      const newCustomer = {
        ...customerData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const docRef = await addDoc(collection(db, 'customers'), newCustomer)
      const customer = { id: docRef.id, ...newCustomer }
      setCustomers((prev) => [...prev, customer])
      return customer
    } catch (err) {
      setError((err as Error).message)
      throw err
    }
  }

  const updateCustomer = async (id: string, customerData: Partial<Customer>) => {
    try {
      setError(null)
      const customerRef = doc(db, 'customers', id)
      const updateData = {
        ...customerData,
        updatedAt: new Date().toISOString(),
      }

      await updateDoc(customerRef, updateData)
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === id ? { ...customer, ...updateData } : customer
        )
      )
    } catch (err) {
      setError((err as Error).message)
      throw err
    }
  }

  const deleteCustomer = async (id: string) => {
    try {
      setError(null)
      await deleteDoc(doc(db, 'customers', id))
      setCustomers((prev) => prev.filter((customer) => customer.id !== id))
    } catch (err) {
      setError((err as Error).message)
      throw err
    }
  }

  const searchCustomers = (query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(lowercaseQuery) ||
        customer.email.toLowerCase().includes(lowercaseQuery) ||
        customer.phone.includes(query)
    )
  }

  return {
    customers,
    loading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
    refreshCustomers: fetchCustomers,
  }
} 