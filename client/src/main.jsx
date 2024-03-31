import React, {Suspense} from 'react'
import ReactDOM from 'react-dom/client'
import App3 from './App3.jsx'
import {GridLoader} from 'react-spinners'
//import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <Suspense fallback={<GridLoader />}>
  {/* <React.StrictMode> */}
    <App3 />
  {/* </React.StrictMode> */}
  </Suspense>,
)
