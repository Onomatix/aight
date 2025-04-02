import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, addDoc, orderBy } from 'firebase/firestore'
import { db } from '../config/firebase'
import { Report, Delivery } from '../types'
import { useAppSelector } from '../store'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAppSelector((state) => state.auth)

  const fetchReports = async (type: Report['type'], startDate: Date, endDate: Date) => {
    try {
      setLoading(true)
      setError(null)
      const reportsRef = collection(db, 'reports')
      const q = query(
        reportsRef,
        where('type', '==', type),
        where('startDate', '>=', startDate.toISOString()),
        where('endDate', '<=', endDate.toISOString()),
        orderBy('startDate', 'desc')
      )

      const querySnapshot = await getDocs(q)
      const reportsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Report[]

      setReports(reportsData)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async (type: Report['type'], startDate: Date, endDate: Date) => {
    try {
      setError(null)
      const deliveriesRef = collection(db, 'deliveries')
      const q = query(
        deliveriesRef,
        where('createdAt', '>=', startDate.toISOString()),
        where('createdAt', '<=', endDate.toISOString())
      )

      const querySnapshot = await getDocs(q)
      const deliveries = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Delivery[]

      const totalDeliveries = deliveries.length
      const completedDeliveries = deliveries.filter(
        (d) => d.status === 'completed'
      ).length
      const cancelledDeliveries = deliveries.filter(
        (d) => d.status === 'cancelled'
      ).length
      const totalRevenue = deliveries.reduce(
        (sum, d) => sum + d.amount,
        0
      )

      const averageDeliveryTime = deliveries
        .filter((d) => d.completedTime && d.scheduledTime)
        .reduce((sum, d) => {
          const start = new Date(d.scheduledTime).getTime()
          const end = new Date(d.completedTime!).getTime()
          return sum + (end - start) / (1000 * 60) // Convert to minutes
        }, 0) / completedDeliveries

      const newReport: Omit<Report, 'id'> = {
        type,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalDeliveries,
        completedDeliveries,
        cancelledDeliveries,
        totalRevenue,
        averageDeliveryTime: averageDeliveryTime || 0,
        createdAt: new Date().toISOString(),
      }

      const docRef = await addDoc(collection(db, 'reports'), newReport)
      const report = { id: docRef.id, ...newReport }
      setReports((prev) => [report, ...prev])
      return report
    } catch (err) {
      setError((err as Error).message)
      throw err
    }
  }

  const generateDailyReport = async (date: Date) => {
    const start = startOfDay(date)
    const end = endOfDay(date)
    return generateReport('daily', start, end)
  }

  const generateWeeklyReport = async (date: Date) => {
    const start = startOfWeek(date)
    const end = endOfWeek(date)
    return generateReport('weekly', start, end)
  }

  const generateMonthlyReport = async (date: Date) => {
    const start = startOfMonth(date)
    const end = endOfMonth(date)
    return generateReport('monthly', start, end)
  }

  return {
    reports,
    loading,
    error,
    fetchReports,
    generateDailyReport,
    generateWeeklyReport,
    generateMonthlyReport,
  }
} 