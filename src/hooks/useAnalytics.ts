import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAppSelector } from '../store'

interface Delivery {
  id: string
  amount: number
  createdAt: string
  completedAt?: string
  rating?: number
  product: string
  quantity: number
}

interface AnalyticsData {
  totalDeliveries: number
  totalRevenue: number
  averageDeliveryTime: number
  customerSatisfaction: number
  popularProducts: Array<{
    name: string
    quantity: number
    revenue: number
  }>
  deliveryTrends: Array<{
    date: string
    deliveries: number
    revenue: number
  }>
}

export const useAnalytics = (timeRange: 'day' | 'week' | 'month' = 'month') => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAppSelector((state) => state.auth)

  const calculateTimeRange = () => {
    const now = new Date()
    const startDate = new Date()

    switch (timeRange) {
      case 'day':
        startDate.setDate(now.getDate() - 1)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
    }

    return { startDate, endDate: now }
  }

  const fetchAnalytics = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const { startDate, endDate } = calculateTimeRange()

      // Fetch deliveries
      const deliveriesRef = collection(db, 'deliveries')
      const deliveriesQuery = query(
        deliveriesRef,
        where('createdAt', '>=', startDate.toISOString()),
        where('createdAt', '<=', endDate.toISOString()),
        orderBy('createdAt', 'desc')
      )

      const deliveriesSnapshot = await getDocs(deliveriesQuery)
      const deliveries = deliveriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Delivery[]

      // Calculate analytics
      const totalDeliveries = deliveries.length
      const totalRevenue = deliveries.reduce((sum, delivery) => sum + delivery.amount, 0)
      const averageDeliveryTime = deliveries.reduce((sum, delivery) => {
        const start = new Date(delivery.createdAt)
        const end = new Date(delivery.completedAt || delivery.createdAt)
        return sum + (end.getTime() - start.getTime()) / (1000 * 60) // Convert to minutes
      }, 0) / totalDeliveries

      // Calculate customer satisfaction (assuming ratings are stored)
      const customerSatisfaction = deliveries.reduce((sum, delivery) => {
        return sum + (delivery.rating || 0)
      }, 0) / totalDeliveries

      // Group deliveries by product
      const productStats = deliveries.reduce((acc, delivery) => {
        const product = delivery.product
        if (!acc[product]) {
          acc[product] = { quantity: 0, revenue: 0 }
        }
        acc[product].quantity += delivery.quantity
        acc[product].revenue += delivery.amount
        return acc
      }, {} as Record<string, { quantity: number; revenue: number }>)

      const popularProducts = Object.entries(productStats)
        .map(([name, stats]) => ({
          name,
          quantity: stats.quantity,
          revenue: stats.revenue,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      // Calculate delivery trends
      const trends = deliveries.reduce((acc, delivery) => {
        const date = new Date(delivery.createdAt).toISOString().split('T')[0]
        if (!acc[date]) {
          acc[date] = { deliveries: 0, revenue: 0 }
        }
        acc[date].deliveries++
        acc[date].revenue += delivery.amount
        return acc
      }, {} as Record<string, { deliveries: number; revenue: number }>)

      const deliveryTrends = Object.entries(trends)
        .map(([date, stats]) => ({
          date,
          deliveries: stats.deliveries,
          revenue: stats.revenue,
        }))
        .sort((a, b) => a.date.localeCompare(b.date))

      setAnalytics({
        totalDeliveries,
        totalRevenue,
        averageDeliveryTime,
        customerSatisfaction,
        popularProducts,
        deliveryTrends,
      })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [user, timeRange])

  return {
    analytics,
    loading,
    error,
    refreshAnalytics: fetchAnalytics,
  }
} 