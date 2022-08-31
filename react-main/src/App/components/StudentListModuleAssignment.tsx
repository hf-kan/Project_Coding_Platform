import React, { Component } from 'react';
import {
  PageHeader,
  Space,
  Table,
  Button,
} from 'antd';

import { Link } from 'react-router-dom';

import { getOneModuleAssignments, getModulesById } from '../../lib/services';

interface Props {
  match: any,
}

class App extends Component
<Props, { assignmentData: any[], moduleName: string }> {
  constructor(props:Props) {
    super(props);
    this.state = {
      assignmentData: [],
      moduleName: '',
    };
  }

  componentDidMount() {
    const getAssignmentData = async () => {
      const { match } = this.props;
      const output: any = [];
      let moduleTitle:string = '';
      getModulesById((match.params.key), (module:any) => {
        moduleTitle = `${module[0].moduleId} ${module[0].name}`;
        getOneModuleAssignments((match.params.key), (arrayOfAssignments:any[]) => {
          arrayOfAssignments.forEach((item) => {
            const startDate:Date = new Date(item.start);
            const endDate:Date = new Date(item.end);
            output.push({
              key: item._id,
              title: item.title,
              start: startDate.toUTCString(),
              end: endDate.toUTCString(),
              duration: Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60)),
            });
          });
          this.setState({
            assignmentData: output,
            moduleName: moduleTitle,
          });
        });
      });
    };
    getAssignmentData().catch(console.error);
  }

  render() {
    const { assignmentData, moduleName } = this.state;
    const { match } = this.props;
    const columns = [
      {
        title: 'Assignment',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Start Datetime',
        dataIndex: 'start',
        key: 'start',
      },
      {
        title: 'End Datetime',
        dataIndex: 'end',
        key: 'end',
      },
      {
        title: 'Duration (mins)',
        dataIndex: 'duration',
        key: 'duration',
      },
      {
        title: 'Action',
        key: 'action',
        render: (_:any, record:any) => {
          const path = `/studentAssignment/${match.params.userKey}/${record.key}`;
          return (
            <Space size="middle">
              <Button type="primary">
                <Link to={path}>Start Assignment</Link>
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
          title="Assignments"
          subTitle={`${moduleName}`}
        />
        <br />
        <br />
        <Table
          columns={columns}
          dataSource={assignmentData}
        />
      </div>
    );
  }
}
export default App;
