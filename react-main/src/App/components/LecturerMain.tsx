import React, { Component } from 'react';
import {
  PageHeader,
  Space,
  Table,
  Button,
} from 'antd';

import {
  Link,
} from 'react-router-dom';

import { getStudentModules, getModulesById, getTermsById } from '../../lib/services';

interface Props {
  userKey: string,
}

class App extends Component
<Props, { moduleData: any[] }> {
  constructor(props:Props) {
    super(props);
    this.state = {
      moduleData: [],
    };
  }

  componentDidMount() {
    const getModuleData = async () => {
      const { userKey } = this.props;
      const output: any = [];
      // each get Function is async, thus necessitate nested callback
      // Get student's enrolled modules, then find details of each module
      // then get each module's term details
      // equivalent to studentmodules inner join modules inner join term
      getStudentModules((userKey), (arrayOfLecturerModuleIds:any[]) => {
        getModulesById(arrayOfLecturerModuleIds, (arrayOfModules:any[]) => {
          const arrayOfTermIds: any[] = [];
          arrayOfModules.forEach((module:any) => arrayOfTermIds.push(module.term));
          getTermsById(arrayOfTermIds, (arrayOfTerms:any[]) => {
            arrayOfLecturerModuleIds.forEach((modId) => {
              const module:any = arrayOfModules.find((obj) => obj._id === modId);
              const term:any = arrayOfTerms.find((obj) => obj._id === module.term);
              output.push({
                key: modId,
                moduleId: module.moduleId,
                module: module.name,
                year: term.year,
                term: term.term,
              });
            });
            this.setState({
              moduleData: output,
            });
          });
        });
      });
    };
    getModuleData().catch(console.error);
  }

  render() {
    const { moduleData } = this.state;
    const { userKey } = this.props;
    const columns = [
      {
        title: 'Module Code',
        dataIndex: 'moduleId',
        key: 'moduleId',
      },
      {
        title: 'Module',
        dataIndex: 'module',
        key: 'module',
      },
      {
        title: 'Year',
        dataIndex: 'year',
        key: 'year',
      },
      {
        title: 'Term',
        dataIndex: 'term',
        key: 'term',
      },
      {
        title: 'Action',
        key: 'action',
        render: (_:any, record:any) => {
          const path = `/lecturerAssignmentList/${userKey}/${record.key}`;
          return (
            <Space size="middle">
              <Button type="primary">
                <Link to={path}>Go to Assignment</Link>
              </Button>
            </Space>
          );
        },
      },
    ];
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title="Modules (Lecturer)"
        />
        <br />
        <br />
        <Table
          columns={columns}
          dataSource={moduleData}
        />
      </div>
    );
  }
}
export default App;
