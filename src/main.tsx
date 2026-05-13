import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Inject Authorization token globally
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const [resource, config] = args;
  const url = typeof resource === 'string' ? resource : resource instanceof Request ? resource.url : '';
  
  if (url.includes('/api/')) {
    const token = localStorage.getItem('userToken');
    if (token) {
      const newConfig = config || {};
      newConfig.headers = {
        ...newConfig.headers,
        Authorization: `Bearer ${token}`
      };
      return originalFetch(resource, newConfig);
    }
  }
  return originalFetch(...args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
