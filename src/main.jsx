import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { StoreProvider } from './context/Store.jsx'
import './index.css'
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter><StoreProvider><App /></StoreProvider></BrowserRouter>
)
