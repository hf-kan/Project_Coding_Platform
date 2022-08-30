import React from 'react';
import { PageHeader, List } from 'antd';
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
    </div>
  );
}

export default MyComponent;
