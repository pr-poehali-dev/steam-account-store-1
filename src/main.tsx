import * as React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { initSecurity } from './utils/security'

initSecurity();

createRoot(document.getElementById("root")!).render(<App />);