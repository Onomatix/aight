import { User, SalesReport, Delivery } from '../types'

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=1',
    phone: '+1234567890',
    lastLogin: '2024-03-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'manager',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=2',
    phone: '+1234567891',
    lastLogin: '2024-03-14T15:45:00Z',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-03-14T15:45:00Z'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'driver',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=3',
    phone: '+1234567892',
    lastLogin: '2024-03-13T09:15:00Z',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-03-13T09:15:00Z'
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'customer',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=4',
    phone: '+1234567893',
    lastLogin: '2024-03-12T14:20:00Z',
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-03-12T14:20:00Z'
  }
]

export const mockSalesReports: SalesReport[] = [
  {
    id: '1',
    date: '2024-03-15',
    totalSales: 15000,
    totalDeliveries: 45,
    averageOrderValue: 333.33,
    topProducts: [
      {
        name: 'Gas Cylinder 12kg',
        quantity: 25,
        revenue: 7500
      },
      {
        name: 'Gas Cylinder 6kg',
        quantity: 30,
        revenue: 4500
      },
      {
        name: 'Gas Cylinder 3kg',
        quantity: 40,
        revenue: 3000
      }
    ]
  }
]

export const mockDeliveries: Delivery[] = [
  {
    id: '1',
    customerName: 'Alice Brown',
    customerPhone: '+1234567893',
    deliveryAddress: '123 Main St, City, Country',
    products: [
      {
        name: 'Gas Cylinder 12kg',
        quantity: 1,
        price: 300
      }
    ],
    totalAmount: 300,
    status: 'completed',
    paymentMethod: 'card',
    driverName: 'Bob Johnson',
    driverPhone: '+1234567892',
    createdAt: '2024-03-15T09:00:00Z',
    updatedAt: '2024-03-15T10:30:00Z'
  },
  {
    id: '2',
    customerName: 'Charlie Wilson',
    customerPhone: '+1234567894',
    deliveryAddress: '456 Oak Ave, City, Country',
    products: [
      {
        name: 'Gas Cylinder 6kg',
        quantity: 2,
        price: 150
      }
    ],
    totalAmount: 300,
    status: 'in-progress',
    paymentMethod: 'cash',
    driverName: 'Bob Johnson',
    driverPhone: '+1234567892',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:15:00Z'
  }
] 