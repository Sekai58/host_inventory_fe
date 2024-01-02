import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ToastProvider from './components/ToastProvider/index.tsx'
import { store } from './app/store.ts'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById('root')!).render(
  
  <React.StrictMode>
    <ToastProvider>
      <Provider store={store}>
      <App />
      </Provider>
    </ToastProvider>
  </React.StrictMode>,
)
