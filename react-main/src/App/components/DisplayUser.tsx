import React, { useState } from 'react';

import { getUserDisplayName } from '../../lib/services';

function MyComponent(props:any) {
  const { userKey } = props;
  const [welcomeMsg, setWelcomeMsg] = useState(String);

  getUserDisplayName(userKey, (displayName:string) => {
    setWelcomeMsg(`You are current signed in as: ${displayName}`);
  });
  return (
    <h3 className="userKey">
      { welcomeMsg }
    </h3>
  );
}

export default MyComponent;
