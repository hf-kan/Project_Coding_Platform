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
  getSubmissionById,
  getModulesById,
  getAssignmentsById,
  getUserPersonalInfo,
} from '../../lib/services';

import parseJUnitReportXML from '../../lib/parseJUnitReportXML';

interface Props {
  match: any,
}

class App extends Component
<Props, {
  userName:string,
  userKey:string,
  assignmentName:string,
  moduleName:string,
  moduleId:string,
  asgnStatus:string,
  score:string,
  parsedReport:any,
}> {
  constructor(props:Props) {
    super(props);
    this.state = {
      userName: '',
      userKey: '',
      assignmentName: '',
      moduleName: '',
      moduleId: '',
      asgnStatus: '',
      score: '',
      parsedReport: {},
    };
  }

  componentDidMount() {
    const retrieveReport = async () => {
      const { match } = this.props;
      getSubmissionById((match.params.key), (submission:any[]) => {
        getAssignmentsById((submission[0].assignmentId), (assignment:any[]) => {
          getModulesById((assignment[0].module), (modules:any[]) => {
            getUserPersonalInfo((submission[0].userKey), (user:any) => {
              this.setState({
                userName: user.username,
                userKey: user.id,
                moduleName: `${modules[0].moduleId} ${modules[0].name}`,
                assignmentName: assignment[0].title,
                score: submission[0].score,
                asgnStatus: submission[0].status,
              });
              if (submission[0].graderXML !== undefined) {
                const parsedReport = parseJUnitReportXML(submission[0].graderXML);
                this.setState({ parsedReport });
              }
            });
          });
        });
      });
    };
    retrieveReport().catch(console.error);
  }

  render() {
    let returnPath:string;
    const { Title } = Typography;
    const { match } = this.props;
    const { mode, key } = match.params;

    const {
      userName,
      userKey,
      assignmentName,
      moduleName,
      moduleId,
      asgnStatus,
      score,
      parsedReport,
    } = this.state;

    const {
      totalTest,
      skippedTest,
      failedTest,
      errorTest,
      successTest,
      testCases,
    } = parsedReport;

    if (mode === 'lecturer') {
      returnPath = `/viewSubmission/${key}`;
    } else {
      returnPath = `/assignmentList/${userKey}/${moduleId}`;
    }

    const columns = [
      {
        title: 'Test No.',
        dataIndex: 'i',
        key: 'i',
      },
      {
        title: 'Test Name',
        dataIndex: 'testCaseName',
        key: 'testCaseName',
      },
      {
        title: 'Test Status',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: 'Details',
        dataIndex: 'message',
        key: 'message',
      },
      {
        title: 'Run Duration (s)',
        dataIndex: 'executionTime',
        key: 'executionTime',
      },
    ];
    if (parsedReport === undefined) {
      return (
        <div>
          <PageHeader
            className="site-page-header"
            title="No Report available for this submission"
          />
          <Button size="large">
            <Link to={returnPath}>Return</Link>
          </Button>
          <br />
          {match.params.key}
        </div>
      );
    }
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title="Assignment Auto-marker Report"
        />
        <Button size="large">
          <Link to={returnPath}>Return</Link>
        </Button>
        <br />
        <br />
        <b>{ 'Username: '}</b>
        { userName }
        <br />
        <b>{ 'Assignment: ' }</b>
        { assignmentName }
        <br />
        <b>{ 'Module: '}</b>
        { moduleName }
        <br />
        <br />
        <b>{ 'Assignment Status: '}</b>
        { asgnStatus }
        <br />
        <b>{ 'Score: '}</b>
        { score }
        <br />
        <br />
        <Title level={5}>Test Results Details:</Title>
        <Space>
          { 'Number of test cases: '}
          { totalTest }
          <br />
          { 'Success: '}
          { successTest }
          <br />
          { 'Failed: '}
          { failedTest }
          <br />
          { 'Failed (Error): '}
          { errorTest }
          <br />
          { 'Skipped: '}
          { skippedTest }
          <br />
        </Space>
        <br />
        <Table
          columns={columns}
          dataSource={testCases}
        />
      </div>
    );
  }
}
export default App;
