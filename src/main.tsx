
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import { store } from './store/store.ts'
import { GoogleOAuthProvider } from '@react-oauth/google';


createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <GoogleOAuthProvider clientId='704525634820-91rpge5c2osvqe099t43akf4i06ntsd5.apps.googleusercontent.com' >
       <App />   
      </GoogleOAuthProvider>
    </Provider>
)
