import { useState } from 'react'
import { Header } from '../components/Header'
import { MapView } from '../components/MapView'
import { Legend } from '../components/Legend'
import { MapLayerToggles } from '../components/MapLayerToggles'
import { TerritoryModal } from '../components/TerritoryModal'
import { MapContext, type MapFilters } from '../context/MapContext'
import { INTRO_BODY } from '../constants/site'
import type { TerritoryRecord } from '../types'

const DEFAULT_MAP_FILTERS: MapFilters = {
  territoryId: '',
  cityTerritoryId: '',
  status: '',
}

export function HomePage() {
  const [selected, setSelected] = useState<TerritoryRecord | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [showPolygons, setShowPolygons] = useState(true)
  const [showMarkers, setShowMarkers] = useState(true)
  const [showWorldExcludeMask, setShowWorldExcludeMask] = useState(true)
  const [filters, setFilters] = useState<MapFilters>(DEFAULT_MAP_FILTERS)

  return (
    <MapContext.Provider value={{ filters, setFilters }}>
      <div className="flex h-dvh flex-col overflow-hidden font-[Poppins,system-ui,sans-serif]">
        <Header showFilters />
        <section className="shrink-0 border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="mx-auto max-w-[1280px]">
            <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
              <span className="font-semibold text-gray-900">WasteConnect</span> {INTRO_BODY}
            </p>
          </div>
        </section>
        <main className="relative min-h-0 flex-1 bg-gray-100">
          <div className="absolute inset-0 z-0">
            <MapView
              showPolygons={showPolygons}
              showMarkers={showMarkers}
              showWorldExcludeMask={showWorldExcludeMask}
              onTerritorySelect={(t) => {
                setSelected(t)
                setModalOpen(true)
              }}
            />
          </div>
          <div className="pointer-events-none absolute right-2 top-2 z-[1000] w-max max-w-[min(calc(100vw-1rem),14rem)] sm:right-4 sm:top-4 sm:max-w-[16rem]">
            <div className="pointer-events-auto">
              <MapLayerToggles
                showPolygons={showPolygons}
                showMarkers={showMarkers}
                showWorldExcludeMask={showWorldExcludeMask}
                onPolygonsChange={setShowPolygons}
                onMarkersChange={setShowMarkers}
                onWorldExcludeMaskChange={setShowWorldExcludeMask}
              />
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-4 right-2 z-[1000] sm:bottom-6 sm:right-4">
            <div className="pointer-events-auto">
              <Legend />
            </div>
          </div>
        </main>
      </div>
      <TerritoryModal territory={selected} open={modalOpen} onOpenChange={setModalOpen} />
    </MapContext.Provider>
  )
}
