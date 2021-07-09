import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Remove StrictMode because fires transferToOffscreenCanvas twice
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
