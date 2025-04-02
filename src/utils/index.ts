import { format, formatDistance } from 'date-fns'

export const formatDate = (date: string | Date) => {
  return format(new Date(date), 'MMM dd, yyyy')
}

export const formatDateTime = (date: string | Date) => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm')
}

export const formatTimeAgo = (date: string | Date) => {
  return formatDistance(new Date(date), new Date(), { addSuffix: true })
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export const formatPhoneNumber = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3]
  }
  return phone
}

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
) => {
  let timeout: NodeJS.Timeout

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password: string) => {
  return password.length >= 8
}

export const validatePhone = (phone: string) => {
  const re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  return re.test(phone)
} 