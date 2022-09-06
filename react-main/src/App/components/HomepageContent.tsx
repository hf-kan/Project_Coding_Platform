import React from 'react';
import { PageHeader, Typography, Layout } from 'antd';
// import LoadUpcomingTest from './LoadUpcomingTest';

function MyComponent() {
  const { Content, Footer } = Layout;
  const { Title } = Typography;
  const Titles: String = 'Welcome to the University of Birmingham Coding Platform v0.1';
  return (
    <Layout className="layout">
      <Content style={{ padding: '20px' }}>
        <div className="site-layout-content">
          <PageHeader
            className="site-page-header"
            title={Titles}
          />
          <br />
          <br />
          <Title level={5}>
            For Students: Click on Student at the menu at the top of the screen to start
          </Title>
          <Title level={5}>
            All assignments should be completed using Java
          </Title>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Hiu Fung Kan @2022 Supervised by: Dr Jacqueline Chetty
      </Footer>
    </Layout>
  );
}

export default MyComponent;
