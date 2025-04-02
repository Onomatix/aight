import { useEffect, useState, useMemo, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import { fetchUsers } from '../store/slices/usersSlice'
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  ClockIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { Spinner } from '../components/Spinner'
import { useDebounce } from '../hooks/useDebounce'
import { ConfirmationDialog } from '../components/Dialog'
import { mockUsers } from '../mock/data'
import { format } from 'date-fns'
import { User, UserRole, UserStatus } from '../types'
import { Pagination } from '../components/Pagination'
import { FilterDropdown } from '../components/FilterDropdown'

const ITEMS_PER_PAGE = 10

export const UserManagement = () => {
  const dispatch = useAppDispatch()
  const { users: reduxUsers, isLoading, error } = useAppSelector((state) => state.users)
  const { darkMode } = useAppSelector((state) => state.theme)
  
  // State
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<keyof User>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | 'all'>('all')
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Use mock data for now
  const users = mockUsers

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const handleSort = useCallback((field: keyof User) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
    setCurrentPage(1) // Reset to first page when sorting changes
  }, [sortField, sortDirection])

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      
      const matchesRole = selectedRole === 'all' || user.role === selectedRole
      const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus
      
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, debouncedSearchTerm, selectedRole, selectedStatus])

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const aValue = a[sortField]?.toString().toLowerCase() || ''
      const bValue = b[sortField]?.toString().toLowerCase() || ''
      const modifier = sortDirection === 'asc' ? 1 : -1
      return aValue > bValue ? modifier : -modifier
    })
  }, [filteredUsers, sortField, sortDirection])

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return sortedUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [sortedUsers, currentPage])

  const totalPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE)

  const handleEdit = useCallback((user: User) => {
    setSelectedUser(user)
    setIsEditing(true)
  }, [])

  const handleDelete = useCallback((user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }, [])

  const confirmDelete = useCallback(async () => {
    if (!selectedUser) return
    try {
      // TODO: Implement delete functionality
      console.log('Deleting user:', selectedUser.id)
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }, [selectedUser])

  const SortIcon = ({ field }: { field: keyof User }) => {
    if (field !== sortField) return null
    return sortDirection === 'asc' ? (
      <ChevronUpIcon className="h-4 w-4 inline-block ml-1" aria-hidden="true" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 inline-block ml-1" aria-hidden="true" />
    )
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    return format(new Date(dateString), 'MMM d, yyyy h:mm a')
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className={`text-xl mb-4 ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
            Error loading users
          </div>
          <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            {error}
          </div>
          <button 
            onClick={() => dispatch(fetchUsers())}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label="Retry loading users"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Manage your system users, their roles and permissions
          </p>
        </div>
        <button
          className={`mt-4 sm:mt-0 inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors backdrop-blur-sm bg-opacity-80`}
          aria-label="Add new user"
        >
          <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
          Add User
        </button>
      </div>

      <div className={`rounded-lg overflow-hidden backdrop-blur-md bg-opacity-20 ${
        darkMode 
          ? 'bg-gray-800/30 border border-gray-700/50 shadow-lg' 
          : 'bg-white/30 border border-gray-200/50 shadow-lg'
      }`}>
        <div className={`p-4 border-b ${
          darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
        }`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 rounded-md leading-5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors backdrop-blur-sm ${
                  darkMode 
                    ? 'bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-400' 
                    : 'bg-white/30 border-gray-200/50 placeholder-gray-500'
                }`}
                placeholder="Search users by name, email or role"
                aria-label="Search users"
              />
            </div>
            <div className="flex gap-2">
              <FilterDropdown<UserRole | 'all'>
                label="Role"
                options={[
                  { value: 'all', label: 'All Roles' },
                  { value: 'admin', label: 'Admin' },
                  { value: 'manager', label: 'Manager' },
                  { value: 'driver', label: 'Driver' },
                  { value: 'customer', label: 'Customer' }
                ]}
                value={selectedRole}
                onChange={setSelectedRole}
                darkMode={darkMode}
              />
              <FilterDropdown<UserStatus | 'all'>
                label="Status"
                options={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' }
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                darkMode={darkMode}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={darkMode ? 'bg-gray-800/30' : 'bg-white/30'}>
              <tr>
                {[
                  { field: 'name' as keyof User, label: 'Name' },
                  { field: 'email' as keyof User, label: 'Email' },
                  { field: 'role' as keyof User, label: 'Role' },
                  { field: 'status' as keyof User, label: 'Status' },
                  { field: 'lastLogin' as keyof User, label: 'Last Login' }
                ].map(({ field, label }) => (
                  <th 
                    key={field}
                    onClick={() => handleSort(field)}
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer select-none ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}
                    scope="col"
                    aria-sort={field === sortField ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
                  >
                    <span className="inline-flex items-center">
                      {label}
                      <SortIcon field={field} />
                    </span>
                  </th>
                ))}
                <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`} scope="col">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              darkMode 
                ? 'bg-gray-800/20 divide-gray-700/50' 
                : 'bg-white/20 divide-gray-200/50'
            }`}>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <Spinner className="h-8 w-8 mx-auto" aria-label="Loading users" />
                  </td>
                </tr>
              ) : sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`px-6 py-8 text-center ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <ExclamationTriangleIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" aria-hidden="true" />
                    <p className="text-lg font-medium">No users found</p>
                    <p className="mt-1 text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className={`transition-colors ${
                    darkMode 
                      ? 'hover:bg-gray-700/30' 
                      : 'hover:bg-gray-50/50'
                  }`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                            alt={user.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className={`text-sm font-medium ${
                            darkMode ? 'text-gray-100' : 'text-gray-900'
                          }`}>
                            {user.name}
                          </div>
                          {user.phone && (
                            <div className="flex items-center text-sm text-gray-500">
                              <PhoneIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full backdrop-blur-sm ${
                        user.status === 'active'
                          ? darkMode 
                            ? 'bg-green-900/30 text-green-200 border border-green-700/50' 
                            : 'bg-green-100/30 text-green-800 border border-green-200/50'
                          : darkMode
                            ? 'bg-red-900/30 text-red-200 border border-red-700/50'
                            : 'bg-red-100/30 text-red-800 border border-red-200/50'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                        {formatDate(user.lastLogin)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(user)}
                        className={`text-indigo-600 hover:text-indigo-900 mr-4 transition-colors ${
                          darkMode ? 'text-indigo-400 hover:text-indigo-300' : ''
                        }`}
                        aria-label={`Edit user ${user.name}`}
                      >
                        <PencilIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className={`text-red-600 hover:text-red-900 transition-colors ${
                          darkMode ? 'text-red-400 hover:text-red-300' : ''
                        }`}
                        aria-label={`Delete user ${user.name}`}
                      >
                        <TrashIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className={`px-4 py-3 border-t ${
            darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
          }`}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              darkMode={darkMode}
            />
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        variant="danger"
        darkMode={darkMode}
      />
    </div>
  )
} 