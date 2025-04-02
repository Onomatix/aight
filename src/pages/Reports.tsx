import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  ArrowDownTrayIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { toast } from 'react-hot-toast'

type ReportType = 'daily' | 'weekly' | 'monthly' | 'yearly'
type DateRange = 'last7days' | 'last30days' | 'last12months' | 'custom'

const data = [
  { name: 'Mon', deliveries: 20, revenue: 2400 },
  { name: 'Tue', deliveries: 28, revenue: 3398 },
  { name: 'Wed', deliveries: 35, revenue: 4800 },
  { name: 'Thu', deliveries: 25, revenue: 3908 },
  { name: 'Fri', deliveries: 32, revenue: 4800 },
  { name: 'Sat', deliveries: 18, revenue: 2800 },
  { name: 'Sun', deliveries: 15, revenue: 2400 },
]

export const Reports = () => {
  const [reportType, setReportType] = useState<ReportType>('daily')
  const [dateRange, setDateRange] = useState<DateRange>('last7days')
  const [startDate, setStartDate] = useState<string>(
    format(new Date().setDate(new Date().getDate() - 7), 'yyyy-MM-dd')
  )
  const [endDate, setEndDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  )

  const handleExport = async () => {
    try {
      // Implement export logic here
      toast.success('Report exported successfully')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export report')
    }
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Reports
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            View and analyze delivery performance and revenue data.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleExport}
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="card p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label
                htmlFor="reportType"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Report Type
              </label>
              <select
                id="reportType"
                className="input mt-1"
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="dateRange"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Date Range
              </label>
              <select
                id="dateRange"
                className="input mt-1"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as DateRange)}
              >
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="last12months">Last 12 Months</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {dateRange === 'custom' && (
              <>
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    className="input mt-1"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    className="input mt-1"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="deliveries"
                  fill="#0066ff"
                  name="Deliveries"
                />
                <Bar
                  yAxisId="right"
                  dataKey="revenue"
                  fill="#00cc66"
                  name="Revenue"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
} 