import React, { useState } from 'react';
import { Typography } from 'antd';

import { getUserDisplayName } from '../../lib/services';

interface Props {
  userKey: string,
}

function MyComponent(props:Props) {
  const { userKey } = props;
  const [welcomeMsg, setWelcomeMsg] = useState(String);
  const { Title } = Typography;
  getUserDisplayName(userKey, (displayName:string) => {
    setWelcomeMsg(`You are currently signed in as: ${displayName}`);
  });
  return (
    <Title level={5}>{ welcomeMsg }</Title>
  );
}

export default MyComponent;
