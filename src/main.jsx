//import React, {Suspense} from 'react'
import ReactDOM from 'react-dom/client'

import App5 from './App5.jsx'

import {GridLoader} from 'react-spinners'


ReactDOM.createRoot(document.getElementById('root')).render(
  //<Suspense fallback={<GridLoader />}>
  // {/* <React.StrictMode> */}
    <App5 />
  //{/* </React.StrictMode> */}
  // </Suspense>,
)
