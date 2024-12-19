import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import ReactDOM from 'react-dom/client';

import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <MantineProvider>
    <App />
  </MantineProvider>,
);
