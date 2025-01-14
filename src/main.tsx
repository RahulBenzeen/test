
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import { store } from './store/store.ts'
import { GoogleOAuthProvider } from '@react-oauth/google';


createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <GoogleOAuthProvider clientId='391591442783-elmlt5igouaarbodf9vc05seel50cfb5.apps.googleusercontent.com' >
       <App />   
      </GoogleOAuthProvider>
    </Provider>
)
