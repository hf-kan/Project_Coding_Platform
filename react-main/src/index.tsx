import React from 'react';
import { render } from 'react-dom';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import Login from './App/Login';
import { msalConfig } from './lib/authConfig';

const msalInstance = new PublicClientApplication(msalConfig);
const root = document.getElementById('root');
render(
  <MsalProvider instance={msalInstance}>
    <Login />
  </MsalProvider>,
  root,
);
