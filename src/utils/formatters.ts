export const formatLKR = (n: number) =>
  'LKR ' + n.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('en-LK', { dateStyle: 'medium', timeStyle: 'short' })

export const truncate = (text: string, n = 80) =>
  text.length > n ? text.slice(0, n) + '…' : text

export const getInitials = (name: string) =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
