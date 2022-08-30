// import { useMsal } from '@azure/msal-react';
/* import { loginRequest } from './authConfig';
import callMsGraph from './graph';

function RequestProfileData(instance:any, accounts:any[], callBack: Function) {
  const request = {
    ...loginRequest,
    account: accounts[0],
  };

  // Silently acquires an access token then attached to a request for Microsoft Graph data
  instance.acquireTokenSilent(request).then((response:any) => {
    callMsGraph(response.accessToken).then((res:any) => callBack(res));
  }).catch(() => {
    instance.acquireTokenPopup(request).then((response:any) => {
      callMsGraph(response.accessToken).then((res:any) => callBack(res));
    });
  });
}

function RequestAccessToken(instance:any, accounts:any[], callBack: Function) {
  const request = {
    ...loginRequest,
    account: accounts[0],
  };

  // Silently acquires an access token, then attached to a request for Microsoft Graph data
  instance.acquireTokenSilent(request).then((response:any) => {
    const Token:any = response.accessToken;
    callBack(Token);
  }).catch(() => {
    instance.acquireTokenPopup(request).then((response:any) => {
      const Token:any = response.accessToken;
      callBack(Token);
    });
  });
}

export { RequestProfileData, RequestAccessToken };
*/
