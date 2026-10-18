/**
 * Reads Data/*.xlsx → src/data/territoriesParsed.json
 * Run from branch360-wasteconnect-ng: npm run data:import
 */
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import XLSX from 'xlsx'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const dataDir = path.join(root, '..', 'Data')

const CANDIDATE_XLSX = [
  'NigeriaWasteMap.xlsx',
  'NigeriaWasteConnect.xlsx',
  'WasteConnect.xlsx',
  'NigeriaWasteConnect_Sample.xlsx',
  'NigeriaInvest_Updated.xlsx',
  'NigeriaInvest.xlsx',
]

/** Client sheet uses mixed InestsMonth / WasteConversionMonth headers (incl. typos). */
const MONTH_COLUMN_CANDIDATES = {
  1: ['InestsMonth1', 'WasteConversionMonth1', 'ValueMonth1', 'WasteMonth1', 'Month1'],
  2: ['WasteConversionMonth2', 'InestsMonth2', 'ValueMonth2', 'WasteMonth2', 'Month2'],
  3: ['InestsMonth3', 'WasteConversionMonth3', 'ValueMonth3', 'WasteMonth3', 'Month3'],
  4: ['WasteConversionMonth4', 'InestsMonth4', 'ValueMonth4', 'WasteMonth4', 'Month4'],
  5: [
    '5WasteConversionMonth3',
    'WasteConversionMonth5',
    'InestsMonth5',
    'ValueMonth5',
    'WasteMonth5',
    'Month5',
  ],
  6: ['WasteConversionMonth6', 'InestsMonth6', 'ValueMonth6', 'WasteMonth6', 'Month6'],
  7: ['WasteConversionMonth7', 'InestsMonth7', 'ValueMonth7', 'WasteMonth7', 'Month7'],
}

function resolveWorkbook() {
  if (process.argv[2]) return path.resolve(process.argv[2])
  for (const name of CANDIDATE_XLSX) {
    const p = path.join(dataDir, name)
    if (fs.existsSync(p)) return p
  }
  return path.join(dataDir, CANDIDATE_XLSX[0])
}

const xlsxPath = resolveWorkbook()
const outPath = path.join(root, 'src', 'data', 'territoriesParsed.json')

function normalizeStatus(raw) {
  const s = String(raw ?? '')
    .trim()
    .toLowerCase()
  if (s === 'green' || s === 'geen') return 'green'
  if (s === 'amber') return 'amber'
  if (s === 'red') return 'red'
  return 'amber'
}

function parseCustomData(raw) {
  if (!raw?.trim()) return []
  const entries = []
  const text = String(raw).replace(/\r\n/g, '\n')
  for (const block of text.split(/\n+/).map((s) => s.trim()).filter(Boolean)) {
    for (const part of block.split(';').map((s) => s.trim()).filter(Boolean)) {
      const idx = part.indexOf(':')
      if (idx > 0) {
        entries.push({
          key: part.slice(0, idx).trim(),
          value: part.slice(idx + 1).trim(),
        })
      }
    }
  }
  return entries
}

function extractOppField(block, pattern) {
  const m = block.match(pattern)
  return m ? m[1].trim() : ''
}

function parseOpportunities(raw) {
  if (!raw?.trim()) return []
  const items = []
  const text = String(raw).replace(/\r\n/g, '\n')
  for (const block of text.split(/;\s*/).map((s) => s.trim()).filter(Boolean)) {
    const flat = block.replace(/\n+/g, ' ').replace(/\s+/g, ' ')
    const name = extractOppField(
      flat,
      /\b(?:name|project|organisation|organization)\s*:\s*([^,]+?)(?=\s*,|\s+producer|\s+sector|\s+amount|$)/i,
    )
    if (!name) continue
    items.push({
      name,
      sector: extractOppField(flat, /\bsector\s*:\s*([^,]+?)(?=\s*,|\s+amount|\s+status|\s+url|$)/i),
      producerOrConsumer: extractOppField(
        flat,
        /\bproducerorconsumer\s*:\s*([^,\s]+)/i,
      ),
      amount: extractOppField(
        flat,
        /\bamount\s*:\s*(.+?)(?=\s+status\s*:|\s*,|\s+url\s*:|$)/i,
      ),
      status: extractOppField(flat, /\bstatus\s*:\s*([^,]+?)(?=\s*,|\s+url\s*:|$)/i),
      url: extractOppField(flat, /\burl\s*:\s*(\S+)/i),
    })
  }
  return items
}

function num(v, fallback = 0) {
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  const n = Number(String(v).replace(/,/g, '').trim())
  return Number.isFinite(n) ? n : fallback
}

function pick(row, keys, fallback = '') {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== '') return row[k]
  }
  return fallback
}

function monthValue(row, m) {
  const keys = MONTH_COLUMN_CANDIDATES[m] ?? [
    `ValueMonth${m}`,
    `WasteMonth${m}`,
    `Month${m}`,
    `InestsMonth${m}`,
  ]
  return num(pick(row, keys), 0)
}

if (!fs.existsSync(xlsxPath)) {
  console.error('Missing workbook:', xlsxPath)
  console.error('Place client Excel in Data/ (e.g. NigeriaWasteConnect.xlsx)')
  process.exit(1)
}

const wb = XLSX.readFile(xlsxPath)
const sheetName = wb.SheetNames[0]
const sheet = wb.Sheets[sheetName]
const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

const snOccurrence = new Map()
const territories = rows.map((row) => {
  const sn = num(row['s/n'], 0)
  const occ = (snOccurrence.get(sn) ?? 0) + 1
  snOccurrence.set(sn, occ)
  const id = occ === 1 ? String(sn) : `${sn}_${occ}`
  const territory = String(row['Territory'] ?? '').trim()
  const territoryLabel = territory || (sn ? `Territory ${sn}` : 'Unknown territory')

  const valueMonths = [1, 2, 3, 4, 5, 6, 7].map((m) => monthValue(row, m))

  const opportunitiesRaw = pick(row, [
    'opportunities',
    'Opportunities',
    'Organisations',
    'Organizations',
    'Projects',
  ])

  return {
    id,
    sn,
    territory,
    territoryLabel,
    developerNotes: String(row['DeveloperNotes'] ?? '').trim(),
    areas: String(row['Areas'] ?? '').trim(),
    population: num(row['Population'], 0),
    households: num(row['Households'], 0),
    kpi: Math.min(100, Math.max(0, num(row['KPI'], 0))),
    sectors: String(row['Sectors'] ?? '').trim(),
    status: normalizeStatus(row['Status']),
    wasteProduced: String(
      pick(row, ['WasteProduced', 'Waste Produced', 'ProjectsActive'], ''),
    ).trim(),
    wasteConsumed: String(
      pick(row, ['WasteConsumed', 'Waste Consumed', 'ProjectsCompleted'], ''),
    ).trim(),
    valueMonth1: valueMonths[0],
    valueMonth2: valueMonths[1],
    valueMonth3: valueMonths[2],
    valueMonth4: valueMonths[3],
    valueMonth5: valueMonths[4],
    valueMonth6: valueMonths[5],
    valueMonth7: valueMonths[6],
    opportunities: parseOpportunities(opportunitiesRaw),
    customData: parseCustomData(row['CustomData']),
  }
})

const payload = {
  generatedAt: new Date().toISOString(),
  sourceSheet: sheetName,
  sourceFile: path.basename(xlsxPath),
  territories,
}

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8')
console.log('Wrote', territories.length, 'territories →', outPath)
