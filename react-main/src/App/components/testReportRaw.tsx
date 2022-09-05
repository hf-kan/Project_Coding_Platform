import React, { Component } from 'react';
import {
  PageHeader,
  Input,
  Button,
  Typography,
  Space,
} from 'antd';

import { Link } from 'react-router-dom';

import {
  getSubmissionById,
  getModulesById,
  getAssignmentsById,
  getUserPersonalInfo,
} from '../../lib/services';

interface Props {
  match: any,
}

class App extends Component
<Props, {
  userName:string,
  assignmentId:string,
  assignmentName:string,
  moduleName:string,
  asgnStatus:string,
  score:string,
  rawReport:any,
  compileError:string,
  loading:boolean,
}> {
  constructor(props:Props) {
    super(props);
    this.state = {
      userName: '',
      assignmentId: '',
      assignmentName: '',
      moduleName: '',
      asgnStatus: '',
      score: '',
      rawReport: '',
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
                moduleName: `${modules[0].moduleId} ${modules[0].name}`,
                assignmentName: assignment[0].title,
                score: submission[0].score,
                asgnStatus: submission[0].status,
                compileError: submission[0].compileError,
                assignmentId: submission[0].assignmentId,
              });
              if (submission[0].graderXML !== undefined) {
                this.setState({ rawReport: submission[0].graderXML, loading: false });
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
    const { TextArea } = Input;
    const { Title } = Typography;
    const { match } = this.props;
    const { mode, key } = match.params;

    const {
      userName,
      assignmentId,
      assignmentName,
      moduleName,
      asgnStatus,
      score,
      rawReport,
      compileError,
      loading,
    } = this.state;

    let returnPath:string;

    if (mode === 'lecturer') {
      returnPath = `/viewSubmission/${match.params.userKey}/${key}`;
    } else {
      returnPath = `/lecturerListStudentSubmissions/${match.params.userKey}/${assignmentId}`;
    }

    let compileErrMsg:string;
    if (compileError === undefined) {
      compileErrMsg = '';
    } else {
      compileErrMsg = compileError;
    }
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

    if ((rawReport === undefined || rawReport === '') && (compileErrMsg === '')) {
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
          title="Assignment Auto-marker Report (Raw Output)"
        />
        <Button size="large" style={{ marginLeft: '20px' }}>
          <Link to={returnPath}>Return</Link>
        </Button>
        <br />
        <br />
        <Space>
          <b>{ 'Username: '}</b>
          { userName }
          <b>{ 'Assignment: ' }</b>
          { assignmentName }
          <b>{ 'Module: '}</b>
          { moduleName }
        </Space>
        <br />
        <Space>
          <b>{ 'Assignment Status: '}</b>
          { asgnStatus }
          <b>{ 'Score: '}</b>
          { score }
        </Space>
        <br />
        <b>{ 'Compile Error: '}</b>
        { compileErrMsg }
        <br />
        <br />
        <Title level={5}>Raw Report</Title>
        <div
          style={{
            overflow: 'auto',
            height: '36em',
          }}
        >
          <TextArea
            id="autoGraderResult"
            value={rawReport}
            readOnly
            rows={22}
            placeholder="Raw Report is displayed here."
          />
        </div>
      </div>
    );
  }
}
export default App;
