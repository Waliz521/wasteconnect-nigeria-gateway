import type { TerritoryStatus } from '../types'

export const STATUS_COLORS: Record<TerritoryStatus, string> = {
  green: '#16a34a',
  amber: '#d97706',
  red: '#dc2626',
}

export const STATUS_LABELS: Record<TerritoryStatus, string> = {
  green: 'Active opportunities',
  amber: 'Limited opportunities',
  red: 'No opportunities',
}

export const STATUS_LEGEND: Record<TerritoryStatus, string> = {
  green: 'Participating state with active opportunities',
  amber: 'Participating state with limited opportunities',
  red: 'Participating state with no opportunities',
}

export function statusStyleColor(status: TerritoryStatus): string {
  return STATUS_COLORS[status] ?? STATUS_COLORS.amber
}
