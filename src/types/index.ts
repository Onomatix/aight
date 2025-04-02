export type UserRole = 'admin' | 'manager' | 'driver' | 'customer'
export type UserStatus = 'active' | 'inactive'
export type DeliveryStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled'
export type PaymentMethod = 'cash' | 'card' | 'mobile-money'

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type UserWithoutPassword = Omit<User, 'password'>

export interface Delivery {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  products: {
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: DeliveryStatus;
  paymentMethod: PaymentMethod;
  driverName?: string;
  driverPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
  location: {
    lat: number;
    lng: number;
  };
  vehicle: {
    type: string;
    plateNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  totalDeliveries: number;
  completedDeliveries: number;
  cancelledDeliveries: number;
  totalRevenue: number;
  averageDeliveryTime: number;
  createdAt: string;
}

export interface ThemeConfig {
  darkMode: boolean;
  sidebarCollapsed: boolean;
}

export interface AppState {
  theme: ThemeConfig;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface SalesReport {
  id: string;
  date: string;
  totalSales: number;
  totalDeliveries: number;
  averageOrderValue: number;
  topProducts: {
    name: string;
    quantity: number;
    revenue: number;
  }[];
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 