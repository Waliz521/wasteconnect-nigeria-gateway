import { useMemo } from 'react'
import * as Select from '@radix-ui/react-select'
import { useMapContext } from '../context/MapContext'
import { useTerritoryData } from '../context/DataContext'
import { SearchableSelect } from './SearchableSelect'
import { WASTECONNECT_LOGO_SRC } from '../constants/site'
import { STATUS_LABELS } from '../data/statusColors'
import type { TerritoryStatus } from '../types'

const ALL_VALUE = '__all__'

const STATUS_OPTIONS: { value: TerritoryStatus | typeof ALL_VALUE; label: string }[] = [
  { value: ALL_VALUE, label: 'All statuses' },
  { value: 'green', label: STATUS_LABELS.green },
  { value: 'amber', label: STATUS_LABELS.amber },
  { value: 'red', label: STATUS_LABELS.red },
]

const filterTriggerClass =
  'inline-flex h-8 min-h-8 w-full items-center justify-between gap-1 overflow-hidden rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-800 shadow-sm hover:border-slate-300 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/25 [&>span]:min-w-0 [&>span]:truncate'

const filterTriggerBarClass = `${filterTriggerClass} w-[9.5rem] min-w-[9.5rem] max-w-[9.5rem] sm:w-[10.5rem] sm:min-w-[10.5rem] sm:max-w-[10.5rem]`

const contentClass =
  'z-[3000] max-h-[min(280px,50dvh)] overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-w-[min(calc(100vw-2rem),20rem)]'

const itemClass =
  'relative flex cursor-pointer select-none items-center px-3 py-2 text-sm outline-none data-[highlighted]:bg-sky-50 data-[highlighted]:text-sky-900'

const labelClass = 'shrink-0 text-xs font-medium text-white/95 sm:text-sm'

function FilterDropdowns({ layout }: { layout: 'bar' | 'stack' }) {
  const { filters, setFilters } = useMapContext()
  const { stateTerritoryFilterOptions, cityTerritoryFilterOptions } = useTerritoryData()

  const territoryOptions = useMemo(
    () => [
      { value: ALL_VALUE, label: 'All states' },
      ...stateTerritoryFilterOptions.map(({ id, label }) => ({ value: id, label })),
    ],
    [stateTerritoryFilterOptions],
  )

  const cityOptions = useMemo(
    () => [
      { value: ALL_VALUE, label: 'All substates' },
      ...cityTerritoryFilterOptions.map(({ id, label }) => ({ value: id, label })),
    ],
    [cityTerritoryFilterOptions],
  )

  const isBar = layout === 'bar'

  return (
    <div
      className={
        isBar
          ? 'flex flex-wrap items-end justify-end gap-x-4 gap-y-2 lg:gap-x-6'
          : 'flex w-full flex-col gap-3'
      }
    >
      <div className={isBar ? 'flex items-center gap-1.5' : 'flex w-full flex-col gap-1.5'}>
        <label className={labelClass}>Territory</label>
        <SearchableSelect
          wide={!isBar}
          fullWidth={!isBar}
          value={filters.territoryId || ALL_VALUE}
          onValueChange={(v) => {
            const territoryId = v === ALL_VALUE ? '' : v
            setFilters((prev) => ({
              ...prev,
              territoryId,
              cityTerritoryId: territoryId ? '' : prev.cityTerritoryId,
            }))
          }}
          options={territoryOptions}
          placeholder="All states"
          searchPlaceholder="Search states..."
          ariaLabel="Filter by state"
          className={
            isBar ? 'w-[9.5rem] min-w-[9.5rem] max-w-[9.5rem] sm:w-[10.5rem] sm:min-w-[10.5rem] sm:max-w-[10.5rem]' : 'w-full'
          }
        />
      </div>
      {cityTerritoryFilterOptions.length > 0 ? (
        <div className={isBar ? 'flex items-center gap-1.5' : 'flex w-full flex-col gap-1.5'}>
          <label className={labelClass}>Substates</label>
          <SearchableSelect
            fullWidth={!isBar}
            value={filters.cityTerritoryId || ALL_VALUE}
            onValueChange={(v) => {
              const cityTerritoryId = v === ALL_VALUE ? '' : v
              setFilters((prev) => ({
                ...prev,
                cityTerritoryId,
                territoryId: cityTerritoryId ? '' : prev.territoryId,
              }))
            }}
            options={cityOptions}
            placeholder="All substates"
            searchPlaceholder="Search substates..."
            ariaLabel="Filter by substate"
            className={
              isBar ? 'w-[9.5rem] min-w-[9.5rem] max-w-[9.5rem] sm:w-[10.5rem] sm:min-w-[10.5rem] sm:max-w-[10.5rem]' : 'w-full'
            }
          />
        </div>
      ) : null}
      <div className={isBar ? 'flex items-center gap-1.5' : 'flex w-full flex-col gap-1.5'}>
        <label className={labelClass}>Status</label>
        <Select.Root
          value={filters.status || ALL_VALUE}
          onValueChange={(v) =>
            setFilters((prev) => ({
              ...prev,
              status: (v === ALL_VALUE ? '' : v) as TerritoryStatus | '',
            }))
          }
        >
          <Select.Trigger
            className={isBar ? filterTriggerBarClass : filterTriggerClass}
            aria-label="Filter by status"
          >
            <Select.Value placeholder="All statuses" />
            <Select.Icon className="ml-auto shrink-0 text-slate-400">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className={contentClass} position="popper" sideOffset={4}>
              <Select.Viewport>
                {STATUS_OPTIONS.map(({ value, label }) => (
                  <Select.Item key={value} value={value} className={itemClass}>
                    <Select.ItemText>{label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    </div>
  )
}

export function Header({ showFilters = true }: { showFilters?: boolean }) {
  return (
    <header className="relative z-[1100] shrink-0 border-b border-[#003a63] bg-[#00487b] font-[Poppins,system-ui,sans-serif] shadow-sm">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:gap-6 lg:py-3.5">
        <img
          src={WASTECONNECT_LOGO_SRC}
          alt="WasteConnect"
          width={160}
          height={40}
          className="h-9 w-auto max-w-[10rem] shrink-0 object-contain object-left sm:h-10"
          decoding="async"
        />
        {showFilters ? (
          <>
            <div className="hidden min-w-0 flex-1 lg:flex lg:justify-end">
              <FilterDropdowns layout="bar" />
            </div>
            <div className="w-full lg:hidden">
              <FilterDropdowns layout="stack" />
            </div>
          </>
        ) : null}
      </div>
    </header>
  )
}
