import { ToastContainer } from 'react-toastify';
import Home from './pages/home/Home'
import { PWAInstall } from './usePWAInstall';
import { OfflineStatus } from '@/components/ui/offlineStatus';
function App() {
  return (
     <>
      <Home />
      <PWAInstall />
      <OfflineStatus />
      <ToastContainer />
     </>
  )
}
export default App;
