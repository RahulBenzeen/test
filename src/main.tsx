
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import { store } from './store/store.ts'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './sw.ts'

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <GoogleOAuthProvider clientId={`${import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}`} >
          <App />   
        </GoogleOAuthProvider>
    </Provider>
)


