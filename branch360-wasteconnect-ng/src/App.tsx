import { DataProvider } from './context/DataContext'
import { HomePage } from './pages/HomePage'

export default function App() {
  return (
    <DataProvider>
      <HomePage />
    </DataProvider>
  )
}
