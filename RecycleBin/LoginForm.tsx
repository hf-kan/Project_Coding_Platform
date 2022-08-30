import React, { useState } from 'react';
import { Input, PageHeader, Button } from 'antd';

async function handleClick() {
  const [data, setData] = useState('');
  try {
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      body: JSON.stringify({
        user: 'user',
        password: 'password',
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();

    setData(result);
  } catch (e:any) {
    console.log(e.message);
  }
}

function LoginForm() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const Titles = 'Login';
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title={Titles}
      />
      <Input
        style={{ width: 500, marginLeft: 20 }}
        addonBefore="Username: "
        placeholder="Enter your username here"
        type="text"
        id="user"
        name="user"
        onChange={(e) => setUser(e.target.value)}
        value={user}
      />
      <br />
      <br />
      <Input.Password
        style={{ width: 500, marginLeft: 20 }}
        addonBefore="Password: "
        placeholder="Enter your password here"
        type="text"
        id="password"
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <br />
      <br />
      Username:
      { user }
      <br />
      Password:
      { password }
      <br />
      <Button onClick={handleClick} style={{ marginLeft: 20 }} type="primary">Login</Button>
    </div>
  );
}

export default LoginForm;
