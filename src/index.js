import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import * as serviceWorker from './serviceWorker'
import { database } from './services/Firebase'

ReactDOM.render(
  <React.StrictMode>
    <App database={database} />
  </React.StrictMode>,
  document.getElementById('root')
)

// Register service worker for offline / install.
serviceWorker.register()
