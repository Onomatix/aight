import { User, UserWithoutPassword, Driver, Delivery, Notification } from '../types'

const API_URL = 'http://localhost:3001'

// Helper function to initialize localStorage with demo data if empty
const initializeLocalStorage = () => {
  const users = localStorage.getItem('users')
  if (!users) {
    localStorage.setItem('users', JSON.stringify([
      {
        id: '1',
        email: 'demo@example.com',
        password: 'demo123',
        name: 'Demo Admin',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]))
  }
}

// Initialize localStorage with demo data
initializeLocalStorage()

// Helper function to get data from localStorage or initialize with default data
const getLocalData = <T>(key: string, defaultValue: T[]): T[] => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : defaultValue
}

// Helper function to save data to localStorage
const saveLocalData = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data))
}

// Mock API functions
export const mockApi = {
  // Authentication
  async login(email: string, password: string): Promise<UserWithoutPassword | null> {
    const users = getLocalData<User>('users', [])
    const user = users.find(u => u.email === email && u.password === password)
    if (user) {
      // Remove password before returning
      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword
    }
    return null
  },

  // Users
  async getUsers(): Promise<UserWithoutPassword[]> {
    return getLocalData<User>('users', []).map(({ password: _, ...user }) => user)
  },

  async createUser(user: Omit<User, 'id'>): Promise<UserWithoutPassword> {
    const users = getLocalData<User>('users', [])
    const newUser = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    users.push(newUser)
    saveLocalData('users', users)
    const { password: _, ...userWithoutPassword } = newUser
    return userWithoutPassword
  },

  // Drivers
  async getDrivers(): Promise<Driver[]> {
    return getLocalData<Driver>('drivers', [])
  },

  async createDriver(driver: Omit<Driver, 'id'>): Promise<Driver> {
    const drivers = getLocalData<Driver>('drivers', [])
    const newDriver = {
      ...driver,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    drivers.push(newDriver)
    saveLocalData('drivers', drivers)
    return newDriver
  },

  async updateDriver(id: string, driver: Partial<Driver>): Promise<Driver> {
    const drivers = getLocalData<Driver>('drivers', [])
    const index = drivers.findIndex(d => d.id === id)
    if (index === -1) throw new Error('Driver not found')
    drivers[index] = { ...drivers[index], ...driver }
    saveLocalData('drivers', drivers)
    return drivers[index]
  },

  // Deliveries
  async getDeliveries(): Promise<Delivery[]> {
    return getLocalData<Delivery>('deliveries', [])
  },

  async createDelivery(delivery: Omit<Delivery, 'id'>): Promise<Delivery> {
    const deliveries = getLocalData<Delivery>('deliveries', [])
    const newDelivery = {
      ...delivery,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    deliveries.push(newDelivery)
    saveLocalData('deliveries', deliveries)
    return newDelivery
  },

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    return getLocalData<Notification>('notifications', [])
      .filter(n => n.userId === userId)
  },

  async createNotification(notification: Omit<Notification, 'id'>): Promise<Notification> {
    const notifications = getLocalData<Notification>('notifications', [])
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    notifications.push(newNotification)
    saveLocalData('notifications', notifications)
    return newNotification
  },

  async markNotificationAsRead(id: string): Promise<void> {
    const notifications = getLocalData<Notification>('notifications', [])
    const index = notifications.findIndex(n => n.id === id)
    if (index === -1) throw new Error('Notification not found')
    notifications[index].read = true
    saveLocalData('notifications', notifications)
  }
} 