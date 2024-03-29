import React, {Suspense} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {GridLoader} from 'react-spinners'
//import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <Suspense fallback={<GridLoader />}>
  {/* <React.StrictMode> */}
    <App />
  {/* </React.StrictMode> */}
  </Suspense>,
)
