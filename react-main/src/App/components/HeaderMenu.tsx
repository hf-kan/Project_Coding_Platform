import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { useMsal } from '@azure/msal-react';

import { loginRequest } from '../../lib/authConfig';

import '../css/App.css';

interface Props {
  userKey: string,
  role: string[],
}

function handleLogout(instance:any) {
  instance.logoutRedirect(loginRequest).catch((e:any) => {
    console.error(e);
  });
}

function MyComponent(props: Props) {
  const { userKey, role } = props;
  const { instance } = useMsal();
  const menuItems:any = [
    <Menu.Item key="1">
      <Link to="/" />
      Home
    </Menu.Item>,
  ];
  for (let i = 0; i < role.length; i += 1) {
    if (role[i] === 'admin') {
      menuItems.push(
        <Menu.Item key="4">
          <Link to="/admin" />
          Administrator
        </Menu.Item>,
      );
    } else if (role[i] === 'lecturer') {
      menuItems.push(
        <Menu.Item key="3">
          <Link to={`/lecturer/${userKey}`} />
          Lecturer
        </Menu.Item>,
      );
    } else if (role[i] === 'student') {
      menuItems.push(
        <Menu.Item key="2">
          <Link to={`/student/${userKey}`} />
          Student
        </Menu.Item>,
      );
    }
  }
  menuItems.push(
    <Menu.Item key="0" onClick={() => handleLogout(instance)}>
      Sign Out
    </Menu.Item>,
  );

  return (
    <Menu
      className="Menu"
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={['1']}
    >
      {menuItems}
    </Menu>
  );
}

export default MyComponent;
