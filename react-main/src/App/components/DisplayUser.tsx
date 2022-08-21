import React from 'react';

function MyComponent() {
  const UserName: String = 'andykan016@gmail.com';
  const WelcomeMessage: String = `Welcome ${UserName}!`;
  return (
    <h3 className="userName">
      { WelcomeMessage }
    </h3>
  );
}

export default MyComponent;
