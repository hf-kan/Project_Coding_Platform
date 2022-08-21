import React, { useState } from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { Button } from 'antd';
import { loginRequest } from '../lib/authConfig';
import PageLayout from './components/PageLayout';
import ProfileData from './components/ProfileData';
import callMsGraph from '../lib/graph';
import App from './App';

function ProfileContent() {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const name = accounts[0] && accounts[0].name;

  function RequestProfileData() {
    const request = {
      ...loginRequest,
      account: accounts[0],
    };

    // Silently acquires an access token then attached to a request for Microsoft Graph data
    instance.acquireTokenSilent(request).then((response) => {
      callMsGraph(response.accessToken).then((res:any) => setGraphData(res));
    }).catch(() => {
      instance.acquireTokenPopup(request).then((response) => {
        callMsGraph(response.accessToken).then((res:any) => setGraphData(res));
      });
    });
  }

  function RequestAccessToken() {
    const request = {
      ...loginRequest,
      account: accounts[0],
    };

    // Silently acquires an access token, then attached to a request for Microsoft Graph data
    instance.acquireTokenSilent(request).then((response) => {
      const Token:any = response.accessToken;
      setAccessToken(Token);
    }).catch(() => {
      instance.acquireTokenPopup(request).then((response) => {
        const Token:any = response.accessToken;
        setAccessToken(Token);
      });
    });
  }

  return (
    <>
      <h5 className="card-title">
        Welcome
        {name}
      </h5>
      {accessToken
        ? <p>Access Token Acquired!</p>
      // : <Button onClick={() => { RequestAccessToken(); }} >Request Access Token</Button>}
        : () => { RequestAccessToken(); }}
      <br />
      {graphData
        ? <ProfileData graphData={graphData} />
        : <Button onClick={() => { RequestProfileData(); }} type="primary">Request Profile Information</Button>}
    </>
  );
}

function Main() {
  return (
    <PageLayout>
      <AuthenticatedTemplate>
        <ProfileContent />
        <App />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <p>You are not signed in! Please sign in.</p>
      </UnauthenticatedTemplate>
    </PageLayout>
  );
}

export default Main;
