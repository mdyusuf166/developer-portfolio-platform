import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/globals.css';
import { isPreviewEntryEnabled } from './preview/preview-gate';

const root = ReactDOM.createRoot(document.getElementById('root')!);

if (import.meta.env.DEV && isPreviewEntryEnabled(import.meta.env.DEV, window.location.pathname)) {
  void import('./preview/PreviewEntry').then(({ default: PreviewEntry }) => {
    root.render(<React.StrictMode><PreviewEntry /></React.StrictMode>);
  });
} else {
  root.render(<React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>);
}
