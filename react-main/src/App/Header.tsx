import React from 'react';
import './css/Header.css';
import Logo from '../../res/pic/logo.png';
import HeaderMenu from './components/HeaderMenu';
import DisplayUser from './components/DisplayUser';

interface Props {
  role: string[],
  userKey: string,
}

function MyComponent(props: Props) {
  const { role } = props;
  return (
    <div className="App">
      <img src={Logo} className="logo" alt="University of Birmingham" />
      <HeaderMenu role={role} />
      <DisplayUser {...props} />
    </div>
  );
}

export default MyComponent;
