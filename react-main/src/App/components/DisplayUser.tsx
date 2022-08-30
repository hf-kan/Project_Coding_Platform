import React, { useState } from 'react';

import { getUserDisplayName } from '../../lib/services';

function MyComponent(props:any) {
  const { username } = props;
  const [welcomeMsg, setWelcomeMsg] = useState(String);

  getUserDisplayName(username, (displayName:string) => {
    setWelcomeMsg(`You are current signed in as: ${displayName}`);
  });
  return (
    <h3 className="userName">
      { welcomeMsg }
    </h3>
  );
}

export default MyComponent;
