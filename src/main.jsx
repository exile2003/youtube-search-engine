import React from 'react'
import ReactDOM from 'react-dom/client'

import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
 
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <MantineProvider>     
        <App />        
    </MantineProvider>    
)
