import React, { useState } from 'react';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
  useIsAuthenticated,
} from '@azure/msal-react';
import { Button, Layout } from 'antd';
import { loginRequest } from '../lib/authConfig';
import PageLayout from './components/PageLayout';
import ProfileData from './components/ProfileData';
import callMsGraph from '../lib/graph';
import App from './AuthenticatedApp';
import './css/Login.css';

function RequestProfileData() {
  const { instance, accounts } = useMsal();
  const request = {
    ...loginRequest,
    account: accounts[0],
  };

  // Silently acquires an access token then attached to a request for Microsoft Graph data
  instance.acquireTokenSilent(request).then((response) => {
    callMsGraph(response.accessToken).then((res:any) => res);
  }).catch(() => {
    instance.acquireTokenPopup(request).then((response) => {
      callMsGraph(response.accessToken).then((res:any) => res);
    });
  });
}

function RequestAccessToken() {
  const { instance, accounts } = useMsal();
  const request = {
    ...loginRequest,
    account: accounts[0],
  };

  // Silently acquires an access token, then attached to a request for Microsoft Graph data
  instance.acquireTokenSilent(request).then((response) => {
    const Token:any = response.accessToken;
    return Token;
  }).catch(() => {
    instance.acquireTokenPopup(request).then((response) => {
      const Token:any = response.accessToken;
      return Token;
    });
  });
}

function Main() {
  const [accessToken, setAccessToken] = useState();
  const [graphData, setgraphData] = useState();

  if (accessToken === undefined || graphData === undefined) {
    if (accessToken === undefined) {
      RequestAccessToken();
      setAccessToken(Token);
    } else
    if (graphData === undefined) {
      const { res } = RequestProfileData();
      setgraphData(res);
    }
    return (
      <PageLayout>
        <AuthenticatedTemplate />
        <UnauthenticatedTemplate>
          <h3>Welcome to UoB Coding Platform. Click the button above to login</h3>
        </UnauthenticatedTemplate>
      </PageLayout>
    );
  }

  const userProps = { accessToken, graphData };
  return (
    <PageLayout>
      <AuthenticatedTemplate>
        <div>
          <App {...userProps} />
        </div>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <h3>Welcome to UoB Coding Platform. Click the button above to login</h3>
      </UnauthenticatedTemplate>
    </PageLayout>
  );
}

export default Main;
