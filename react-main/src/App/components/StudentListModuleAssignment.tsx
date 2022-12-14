import React, { Component } from 'react';
import {
  PageHeader,
  Space,
  Table,
  Button,
  Typography,
} from 'antd';

import { Link } from 'react-router-dom';

import {
  getOneModuleAssignments,
  getModulesById,
  getSubmissionsByUser,
  getCurrentDateTime,
} from '../../lib/services';

interface Props {
  match: any,
}

class App extends Component
<Props, { assignmentData: any[], moduleName: string, }> {
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
      let status: string;
      let moduleTitle:string = '';
      getModulesById((match.params.key), (module:any) => {
        moduleTitle = `${module[0].moduleId} ${module[0].name}`;
        getOneModuleAssignments((match.params.key), (arrayOfAssignments:any[]) => {
          getSubmissionsByUser((match.params.userKey), (arrayOfSubmissions:any[]) => {
            getCurrentDateTime((curDate:Date) => {
              arrayOfAssignments.forEach((item) => {
                const startDate:Date = new Date(item.start);
                const endDate:Date = new Date(item.end);
                const assignmentId:string = item._id;
                const submission:any = arrayOfSubmissions.find(
                  (sub:any) => sub.assignmentId === assignmentId,
                );
                if (submission === undefined) {
                  if (item.start > curDate) {
                    status = 'NotAvailable';
                  } else if (item.end < curDate) {
                    status = 'DidNotAttempt';
                  } else {
                    status = 'Available';
                  }
                  output.push({
                    key: item._id,
                    title: item.title,
                    start: startDate.toLocaleString(),
                    end: endDate.toLocaleString(),
                    duration: Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60)),
                    status,
                  });
                } else {
                  const formatDate:string = new Date(submission.lastUpdateDtm).toLocaleString();
                  output.push({
                    key: item._id,
                    title: item.title,
                    start: startDate.toLocaleString(),
                    end: endDate.toLocaleString(),
                    duration: Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60)),
                    status: submission.status,
                    score: submission.score,
                    lastUpdateDtm: formatDate,
                  });
                }
              });
              this.setState({
                assignmentData: output,
                moduleName: moduleTitle,
              });
            });
          });
        });
      });
    };
    getAssignmentData().catch(console.error);
  }

  render() {
    const { assignmentData, moduleName } = this.state;
    const { match } = this.props;
    const { Title } = Typography;
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
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: 'Score',
        dataIndex: 'score',
        key: 'score',
      },
      {
        title: 'Last Update',
        dataIndex: 'lastUpdateDtm',
        key: 'lastUpdateDtm',
      },
      {
        title: 'Action',
        key: 'action',
        render: (_:any, record:any) => {
          const path = `/studentAssignment/${match.params.userKey}/${record.key}`;
          return (
            <Space size="middle">
              <Button type="primary">
                <Link to={path}>Start / View Assignment</Link>
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
        <Space direction="vertical" size="small">
          <Button size="large">
            <Link to={`/student/${match.params.userKey}`}>Return to Student Homepage</Link>
          </Button>
          <br />
          <Title level={5}>Select an assignment from the table below to continue:</Title>
        </Space>
        <Table
          columns={columns}
          dataSource={assignmentData}
        />
      </div>
    );
  }
}
export default App;
