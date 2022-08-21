import React from 'react';
import { useMsal } from '@azure/msal-react';
import { Button } from 'antd';

import { loginRequest } from '../../lib/authConfig';

function handleLogout(instance:any) {
  instance.logoutRedirect(loginRequest).catch((e:any) => {
    console.error(e);
  });
}

/**
 * Renders a button which, when selected, will open a popup for login
 */

function SignOutButton() {
  const { instance } = useMsal();
  return (
    <Button onClick={() => handleLogout(instance)} style={{ marginLeft: 20 }} type="primary">Sign out using Redirect</Button>
  );
}
export default SignOutButton;
