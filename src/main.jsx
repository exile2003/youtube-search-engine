import React from 'react'
import ReactDOM from 'react-dom/client'

import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
 
import App from './App.jsx'
import { Modal } from './components/Modal-mantine.jsx'
import { Demo } from './components/Demo.jsx'
//import "./App.css"


ReactDOM.createRoot(document.getElementById('root')).render(
    <MantineProvider>     
        <App />
        <Demo/>
    </MantineProvider>
    
)
