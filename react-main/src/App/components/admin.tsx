import React, { Component } from 'react';
import {
  PageHeader, Button, Space,
} from 'antd';

import { Link } from 'react-router-dom';

class App extends Component
<{}, {}> {
  constructor(props:any) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title="Administrator Menu"
        />
        <br />
        <Space direction="vertical">
          <Button
            style={{ marginLeft: 20, minWidth: '200px' }}
            type="primary"
            size="large"
          >
            <Link to="/addTerm">Add New Term</Link>
          </Button>
          <br />
          <Button
            style={{ marginLeft: 20, minWidth: '200px' }}
            type="primary"
            size="large"
          >
            <Link to="/addModule">Add New Module</Link>
          </Button>
          <br />
          <Button
            style={{ marginLeft: 20, minWidth: '200px' }}
            type="primary"
            size="large"
          >
            <Link to="/addUser">Add New User</Link>
          </Button>
          <br />
          <Button
            style={{ marginLeft: 20, minWidth: '200px' }}
            type="primary"
            size="large"
          >
            <Link to="/addAssignment">Add New Assignment</Link>
          </Button>
        </Space>
      </div>
    );
  }
}
export default App;
