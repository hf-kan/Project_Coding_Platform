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
  assignmentId:string,
  assignmentName:string,
  moduleName:string,
  asgnStatus:string,
  score:string,
  parsedReport:any,
  compileError:string,
  loading:boolean,
}> {
  constructor(props:Props) {
    super(props);
    this.state = {
      userName: '',
      userKey: '',
      assignmentId: '',
      assignmentName: '',
      moduleName: '',
      asgnStatus: '',
      score: '',
      parsedReport: '',
      compileError: '',
      loading: true,
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
                assignmentId: submission[0].assignmentId,
                assignmentName: assignment[0].title,
                score: submission[0].score,
                asgnStatus: submission[0].status,
                compileError: submission[0].compileError,
              });
              if (submission[0].graderXML !== undefined) {
                const parsedReport = parseJUnitReportXML(submission[0].graderXML);
                this.setState({ parsedReport, loading: false });
              } else {
                this.setState({ loading: false });
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
      assignmentId,
      assignmentName,
      moduleName,
      asgnStatus,
      score,
      parsedReport,
      compileError,
      loading,
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
      returnPath = `/viewSubmission/${match.params.userKey}/${key}`;
    } else if (mode === 'fromList') {
      returnPath = `/lecturerListStudentSubmissions/${match.params.userKey}/${assignmentId}`;
    } else {
      returnPath = `/studentAssignment/${userKey}/${assignmentId}`;
    }

    let compileErrMsg:string;
    if (compileError === undefined) {
      compileErrMsg = '';
    } else {
      compileErrMsg = compileError;
    }

    const columns = [
      {
        title: 'Test No.',
        dataIndex: 'key',
        key: 'key',
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

    if (loading) {
      return (
        <div>
          <PageHeader
            className="site-page-header"
            title="Loading Test Report"
          />
          <Button size="large" style={{ marginLeft: '20px' }}>
            <Link to={returnPath}>Return</Link>
          </Button>
          <br />
        </div>
      );
    }

    if ((parsedReport === undefined || parsedReport === '') && (compileErrMsg === '')) {
      return (
        <div>
          <PageHeader
            className="site-page-header"
            title="No Report available for this submission"
          />
          <Button size="large" style={{ marginLeft: '20px' }}>
            <Link to={returnPath}>Return</Link>
          </Button>
          <br />
        </div>
      );
    }
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title="Assignment Auto-marker Report"
        />
        <Button size="large" style={{ marginLeft: '20px' }}>
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
        <b>{ 'Compile Error: '}</b>
        { compileErrMsg }
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
