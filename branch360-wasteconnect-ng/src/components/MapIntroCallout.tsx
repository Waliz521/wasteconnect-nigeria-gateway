import { useState } from 'react'
import { INTRO_BODY } from '../constants/site'

const SESSION_KEY = 'wasteconnect-intro-collapsed'

function introExpandedInitially() {
  try {
    return sessionStorage.getItem(SESSION_KEY) !== '1'
  } catch {
    return true
  }
}

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 11v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1.25" fill="currentColor" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function MapIntroCallout() {
  const [expanded, setExpanded] = useState(introExpandedInitially)

  const collapse = () => {
    setExpanded(false)
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  const expand = () => setExpanded(true)

  if (expanded) {
    return (
      <div className="pointer-events-none absolute left-2 top-2 z-[1000] max-w-[min(calc(100vw-1rem),22rem)] sm:left-4 sm:top-4 sm:max-w-md">
        <div
          className="pointer-events-auto rounded-lg border border-gray-200 bg-white/95 p-3 text-sm leading-relaxed text-gray-700 shadow-md backdrop-blur-sm sm:p-4"
          role="region"
          aria-label="About WasteConnect"
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <p className="font-medium text-gray-900">About this map</p>
            <button
              type="button"
              onClick={collapse}
              className="shrink-0 rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              aria-label="Collapse introduction"
            >
              <CloseIcon />
            </button>
          </div>
          <p>
            <span className="font-semibold text-gray-900">WasteConnect</span> {INTRO_BODY}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="pointer-events-none absolute left-2 top-2 z-[1000] sm:left-4 sm:top-4">
      <button
        type="button"
        onClick={expand}
        className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white/95 text-[#00487b] shadow-md backdrop-blur-sm hover:bg-white"
        aria-label="Show WasteConnect introduction"
        title="About WasteConnect"
      >
        <InfoIcon />
      </button>
    </div>
  )
}
