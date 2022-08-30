import React from 'react';
import { useMsal } from '@azure/msal-react';
import { Button } from 'antd';

import { loginRequest } from '../../lib/authConfig';

function handleLogin(instance:any) {
  instance.loginRedirect(loginRequest).catch((e:any) => {
    console.error(e);
  });
}

/**
 * Renders a button which, when selected, will open a popup for login
 */

function SignInButton() {
  const { instance } = useMsal();
  return (
    <div>
      <br />
      <Button onClick={() => handleLogin(instance)} style={{ marginLeft: 20 }} size="large" type="primary">Sign in</Button>
    </div>
  );
}
export default SignInButton;
