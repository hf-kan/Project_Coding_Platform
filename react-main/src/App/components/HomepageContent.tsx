import React from 'react';
import { PageHeader, List, Button } from 'antd';
import LoadUpcomingTest from './LoadUpcomingTest';

type Test = {
    term: String;
    module: String;
    title: String
    startdt: Date;
    enddt: Date;
}

function MyComponent() {
  const Titles: String = 'Upcoming Test';
  const UpcomingTests: Test[] = LoadUpcomingTest();
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title={Titles}
      />
      <List
        size="large"
        bordered
        dataSource={UpcomingTests}
        renderItem={(item) => <List.Item>{item.title}</List.Item>}
      />
      <br />
      <Button style={{ marginLeft: 20 }} type="primary">Click to add test user</Button>
    </div>
  );
}

export default MyComponent;
