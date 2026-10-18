import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'
import type { TerritoryStatus } from '../types'

export interface MapFilters {
  territoryId: string
  cityTerritoryId: string
  status: TerritoryStatus | ''
}

interface MapContextValue {
  filters: MapFilters
  setFilters: Dispatch<SetStateAction<MapFilters>>
}

const MapContext = createContext<MapContextValue | null>(null)

export function useMapContext(): MapContextValue {
  const ctx = useContext(MapContext)
  if (!ctx) throw new Error('useMapContext must be used within MapContext.Provider')
  return ctx
}

export { MapContext }
