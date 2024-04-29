import React, { unstable_Profiler as Profiler } from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    // <Profiler id="Someid" >
    <App />
    // </Profiler> 
  // </React.StrictMode> 
)
