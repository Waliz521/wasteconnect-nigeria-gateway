export type TerritoryStatus = 'green' | 'amber' | 'red'

/** @deprecated alias kept for map layer code */
export type InvestStatus = TerritoryStatus

export interface CustomDataEntry {
  key: string
  value: string
}

export interface WasteOpportunity {
  name: string
  sector: string
  producerOrConsumer: string
  amount: string
  status: string
  url: string
}

export interface TerritoryRecord {
  /** Unique key for filters/map (duplicate Excel s/n → "6_2", …) */
  id: string
  sn: number
  territory: string
  territoryLabel: string
  developerNotes: string
  areas: string
  population: number
  households: number
  kpi: number
  sectors: string
  status: TerritoryStatus
  wasteProduced: string
  wasteConsumed: string
  valueMonth1: number
  valueMonth2: number
  valueMonth3: number
  valueMonth4: number
  valueMonth5: number
  valueMonth6: number
  valueMonth7: number
  opportunities: WasteOpportunity[]
  customData: CustomDataEntry[]
}

export interface TerritoriesPayload {
  generatedAt: string
  sourceSheet: string
  sourceFile: string
  territories: TerritoryRecord[]
}
