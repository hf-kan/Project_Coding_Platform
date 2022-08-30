import React from 'react';
import { useIsAuthenticated } from '@azure/msal-react';

import SignInButton from './SignInButton';
// import SignOutButton from './SignOutButton';

/**
 * Renders the navbar component with a sign-in button if a user is not authenticated
 */

function PageLayout(props:any) {
  const isAuthenticated = useIsAuthenticated();
  const { children } = props;
  if (isAuthenticated) {
    return (
      <div>
        { children }
      </div>
    );
  }
  return (
    <div>
      <SignInButton />
      <br />
      { children }
    </div>
  );
}

export default PageLayout;
