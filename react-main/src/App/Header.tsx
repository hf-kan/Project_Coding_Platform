import React from 'react';
import './css/Header.css';
import Logo from '../../res/pic/logo.png';
import HeaderMenu from './components/HeaderMenu';

interface Props {
  userKey: string,
  role: string[],
}

function MyComponent(props: Props) {
  const { userKey, role } = props;
  return (
    <div className="App">
      <img src={Logo} className="logo" alt="University of Birmingham" />
      <HeaderMenu userKey={userKey} role={role} />
    </div>
  );
}

export default MyComponent;
