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

import {
  getAssignmentsById,
  getModulesById,
  getSubmissionsByAssignment,
  getStudentsByModule,
} from '../../lib/services';

interface Props {
  match: any,
}

class App extends Component
<Props, { submissionData: any[], moduleName: string, assignmentName: string }> {
  constructor(props:Props) {
    super(props);
    this.state = {
      submissionData: [],
      moduleName: '',
      assignmentName: '',
    };
  }

  componentDidMount() {
    const getSubmissionData = async () => {
      const { match } = this.props;
      const output: any = [];
      let submission: any;
      getAssignmentsById((match.params.key), (assignment:any) => {
        this.setState({ assignmentName: assignment[0].title });
        getModulesById(assignment[0].module, (module:any) => {
          this.setState({ moduleName: `(${module[0].moduleId}) ${module[0].name}` });
          getSubmissionsByAssignment(match.params.key, (arrayOfSubmissions:any[]) => {
            getStudentsByModule(assignment[0].module, (arrayOfStudents:any[]) => {
              arrayOfStudents.forEach((student) => {
                submission = arrayOfSubmissions.find(
                  (sub) => sub.userKey === student.id,
                );
                if (submission === undefined) {
                  output.push({
                    key: student.id,
                    userId: student.userId,
                    username: student.username,
                    name: student.name,
                    status: 'DidNotAttempt',
                  });
                } else {
                  const formatDate:string = new Date(submission.lastUpdateDtm).toLocaleString();
                  output.push({
                    key: student.id,
                    userId: student.userId,
                    username: student.username,
                    name: student.name,
                    status: submission.status,
                    lastUpdateDtm: formatDate,
                    score: submission.score,
                    submissionId: submission._id,
                  });
                }
              });
              this.setState({ submissionData: output });
            });
          });
        });
      });
    };
    getSubmissionData().catch(console.error);
  }

  render() {
    const { submissionData, moduleName, assignmentName } = this.state;
    const columns = [
      {
        title: 'Student ID',
        dataIndex: 'userId',
        key: 'userId',
      },
      {
        title: 'Student Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Assignment Status',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: 'Last Updated DateTime',
        dataIndex: 'lastUpdateDtm',
        key: 'lastUpdateDtm',
      },
      {
        title: 'Score',
        dataIndex: 'score',
        key: 'score',
      },
      {
        title: 'Action',
        key: 'action',
        render: (_:any, record:any) => {
          if (record.status !== 'DidNotAttempt') {
            const viewPath = `/viewSubmission/${record.submissionId}`;
            const testReportPath = `/ViewReport/fromList/${record.submissionId}`;
            const rawReportPath = `/ViewReportRaw/fromList/${record.submissionId}`;
            return (
              <Space size="small">
                <Button type="link">
                  <Link to={viewPath}>View Submission / Run Auto-marker</Link>
                </Button>
                <Button type="link">
                  <Link to={testReportPath}>Test Report</Link>
                </Button>
                <Button type="link">
                  <Link to={rawReportPath}>Raw Test Report</Link>
                </Button>
              </Space>
            );
          }
          return (
            <Space size="middle">
              <h4>No Actions available</h4>
            </Space>
          );
        },
      },
    ];
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title={`Students enrolled in ${moduleName}`}
          subTitle={`Assignment: ${assignmentName}`}
        />
        <br />
        <br />
        <Table
          columns={columns}
          dataSource={submissionData}
        />
      </div>
    );
  }
}

export default App;
