
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import { store } from './store/store.ts'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './sw.ts'
// import { I18nextProvider } from 'react-i18next'
// import i18n from './i18n/config.ts'

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      {/* <I18nextProvider i18n={i18n}> */}
        <GoogleOAuthProvider clientId='704525634820-91rpge5c2osvqe099t43akf4i06ntsd5.apps.googleusercontent.com' >
          <App />   
        </GoogleOAuthProvider>
      {/* </I18nextProvider> */}
    </Provider>
)


