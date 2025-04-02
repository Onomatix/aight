import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  TruckIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

const data = [
  { name: 'Jan', sales: 4000, deliveries: 2400 },
  { name: 'Feb', sales: 3000, deliveries: 1398 },
  { name: 'Mar', sales: 2000, deliveries: 9800 },
  { name: 'Apr', sales: 2780, deliveries: 3908 },
  { name: 'May', sales: 1890, deliveries: 4800 },
  { name: 'Jun', sales: 2390, deliveries: 3800 },
]

const stats = [
  {
    name: 'Total Deliveries',
    value: '2,543',
    icon: TruckIcon,
    change: '+12.3%',
    changeType: 'positive',
  },
  {
    name: 'Active Users',
    value: '1,234',
    icon: UserGroupIcon,
    change: '+10.1%',
    changeType: 'positive',
  },
  {
    name: 'Revenue',
    value: '$45,678',
    icon: CurrencyDollarIcon,
    change: '+8.2%',
    changeType: 'positive',
  },
  {
    name: 'Success Rate',
    value: '98.5%',
    icon: ChartBarIcon,
    change: '+1.2%',
    changeType: 'positive',
  },
]

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="card overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon
                  className="h-8 w-8 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {stat.name}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div
                      className={`inline-flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
          Sales & Deliveries Overview
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="sales"
                stackId="1"
                stroke="#0066ff"
                fill="#0066ff"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="deliveries"
                stackId="1"
                stroke="#00cc66"
                fill="#00cc66"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
} 