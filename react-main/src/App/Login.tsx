import React, { useState } from 'react';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from '@azure/msal-react';
import { Button, Typography } from 'antd';

import PageLayout from './components/PageLayout';
import { loginRequest } from '../lib/authConfig';
import callMsGraph from '../lib/graph';
import MainApp from './App';
import './css/Login.css';

function ProfileContent() {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  function RequestProfileData() {
    const request = {
      ...loginRequest,
      account: accounts[0],
    };

    // Silently acquires an access token then attached to a request for Microsoft Graph data
    instance.acquireTokenSilent(request).then((response) => {
      callMsGraph(response.accessToken).then((res:any) => {
        const Token:any = response.accessToken;
        setAccessToken(Token);
        setGraphData(res);
      });
    }).catch(() => {
      instance.acquireTokenPopup(request).then((response) => {
        callMsGraph(response.accessToken).then((res:any) => {
          const Token:any = response.accessToken;
          setAccessToken(Token);
          setGraphData(res);
        });
      });
    });
  }

  return (
    <div>
      {graphData
        ? <MainApp accessToken={accessToken} graphData={graphData} />
        : <Button style={{ margin: 20 }} size="large" onClick={() => { RequestProfileData(); }} type="primary">Enter UoB Coding Platform</Button>}
    </div>
  );
}

function Main() {
  const { Title } = Typography;
  return (
    <PageLayout>
      <AuthenticatedTemplate>
        <ProfileContent />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Title level={5} style={{ marginLeft: '20px' }}>
          Welcome to UoB Coding Platform. Click the button above to sign in
        </Title>
      </UnauthenticatedTemplate>
    </PageLayout>
  );
}

export default Main;
