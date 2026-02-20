/*
 * Purpose: Lightweight application root that renders the central router.
 * API Integration: No direct API calls; route pages contain API integration logic.
 * State Management: Consumes global state indirectly through nested pages/components.
 * Navigation Flow: Delegates all navigation handling to AppRouter.
 * Backend Connection: Router pages use Axios service modules configured with VITE_API_BASE_URL.
 */
import AppRouter from './AppRouter'

function App() {
  return <AppRouter />
}

export default App
