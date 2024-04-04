import React, {Suspense} from 'react'
import ReactDOM from 'react-dom/client'
//import App3 from './App3.jsx'
import App2 from './App2.jsx'
import {GridLoader} from 'react-spinners'
//import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <Suspense fallback={<GridLoader />}>
  {/* <React.StrictMode> */}
    <App2 />
  {/* </React.StrictMode> */}
  </Suspense>,
)
