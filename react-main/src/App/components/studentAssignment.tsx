// reference from: https://stackoverflow.com/questions/69302758/why-is-my-react-code-editor-component-not-highlighted-by-prismjs
// timer implementation referenced: https://stackoverflow.com/questions/36299174/setinterval-in-a-react-app
import React, { Component } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import {
  PageHeader,
  Space,
  Button,
  Layout,
  Input,
  Col,
  Row,
  Popconfirm,
} from 'antd';

import {
  Link,
} from 'react-router-dom';

import { AxiosResponse } from 'axios';

import {
  getAssignmentsByIdFiltered,
  getSubmissionsByUserAssignment,
  addSubmission,
  updateSubmission,
  submitSubmission,
  getCurrentDateTime,
} from '../../lib/services';

import Timer from './timer';

import testRun from './testRunSubmission';

interface Props {
  match: any,
}

class App extends Component
<Props, {
  assignmentName: string,
  assignmentDescr: string,
  start: Date,
  end: Date,
  code: string,
  testCase:string,
  runResult: string,
  waiting: boolean,
  waitErrorMessage: string,
  submitConfirmVisible: boolean,
  submitAnimation: boolean,
  statusMessage: string,
  readOnly: boolean;
  hideReportButton: boolean,
  countDown:any,
  intervalId:any,
  notStart:boolean,
  module:any,
}> {
  submissionDocument: any;

  timer: Function;

  constructor(props:Props) {
    super(props);
    this.state = {
      assignmentName: '',
      assignmentDescr: '',
      start: new Date(),
      end: new Date(),
      code: '',
      testCase: '',
      runResult: '',
      waiting: false,
      waitErrorMessage: '',
      submitConfirmVisible: false,
      submitAnimation: false,
      statusMessage: '',
      readOnly: true,
      hideReportButton: true,
      countDown: 0,
      intervalId: 0,
      notStart: true,
      module: '',
    };
    this.submissionDocument = {};
    this.timer = () => {
      // get Datetime from backend server to prevent cheating by altering local datetime
      const { end } = this.state;
      getCurrentDateTime((curr:any) => {
        const currDate:Date = new Date(curr);
        const count:number = end.getTime() - currDate.getTime();
        if (count <= 0) {
          this.setState({
            countDown: 0,
            readOnly: true,
          });
        } else {
          this.setState({
            countDown: count,
            readOnly: false,
            statusMessage: '',
            hideReportButton: true,
          });
        }
      });
    };
  }
  // get the details of the current assignment
  // then check if first open (by checking if submission exist for current user and assignment)
  // if first open, create a new submission with status = InProgress

  componentDidMount() {
    const getAssignmentData = async () => {
      const { match } = this.props;
      let assignment: any;
      let submissionFromDB: any[] = [];
      let statusMessage:string = '';
      let hideReportButton:boolean = true;
      getAssignmentsByIdFiltered((match.params.key), (assignmentArray:any) => {
        // load assignment details
        [assignment] = assignmentArray;
        const start:Date = new Date(assignment.start);
        const end:Date = new Date(assignment.end);
        getCurrentDateTime((curr:any) => {
          const currDate:Date = new Date(curr);
          if (currDate >= start) {
            this.setState({
              assignmentName: assignment.title,
              assignmentDescr: assignment.descr,
              start,
              end,
              notStart: false,
              module: assignment.module,
            });
            const intervalId = setInterval(this.timer, 1000);
            this.setState({ intervalId });
            getSubmissionsByUserAssignment(
              // try to load students' submission
              (match.params.userKey),
              (match.params.key),
              (arrayOfSubmissions:any[]) => {
                const { readOnly } = this.state;
                if (arrayOfSubmissions.length === 0 && !readOnly) {
                  // No existing submission, create a submission in database
                  // and load skeleton code
                  const message: any[] = [{
                    assignmentId: match.params.key,
                    userKey: match.params.userKey,
                    programCode: assignment.skeletonCode,
                  }];
                  addSubmission(message, (res:AxiosResponse) => {
                    if (res.status === 200) {
                      this.submissionDocument = res.data;
                    } else {
                      this.setState({ statusMessage: `Error communicating with Database: ${res.data}` });
                    }
                    this.setState({
                      code: this.submissionDocument.programCode,
                      statusMessage: '',
                    });
                  });
                } else if (arrayOfSubmissions.length !== 0 && !readOnly) {
                  [submissionFromDB] = arrayOfSubmissions;
                  this.submissionDocument = submissionFromDB;
                  // submission already exists
                  // update lastupdatedtm only and load skeleton code if code is empty
                  updateSubmission(submissionFromDB, (res:AxiosResponse) => {
                    if (res.status === 200) {
                      this.submissionDocument = res.data;
                      if (this.submissionDocument.programCode.length === 0) {
                        this.submissionDocument.programCode = assignment.skeletonCode;
                      }
                    } else {
                      this.setState({ statusMessage: `Error communicating with Database: ${res.data}` });
                    }
                    this.setState({
                      code: this.submissionDocument.programCode,
                      statusMessage: '',
                    });
                  });
                } else {
                  // read only
                  let programCode:string = assignment.skeletonCode;
                  if (arrayOfSubmissions.length !== 0) {
                    [submissionFromDB] = arrayOfSubmissions;
                    this.submissionDocument = submissionFromDB;
                    programCode = this.submissionDocument.programCode;
                    if (this.submissionDocument.status === 'Graded') {
                      statusMessage = 'This assignment has been graded. Click on the button to view report';
                      hideReportButton = false;
                    } else if (this.submissionDocument.status === 'Submitted') {
                      statusMessage = 'This assignment has been submitted. Pending for grading';
                    } else {
                      statusMessage = 'This assignment is closed';
                    }
                  }
                  this.setState({
                    code: programCode,
                    statusMessage,
                    hideReportButton,
                  });
                }
              },
            );
          } else {
            this.setState({
              module: assignment.module,
            });
          }
        });
      });
    };
    getAssignmentData().catch(console.error);
  }

  componentWillUnmount() {
    const { intervalId } = this.state;
    clearInterval(intervalId);
  }

  render() {
    const { Sider, Content } = Layout;
    const {
      assignmentName,
      assignmentDescr,
      code,
      testCase,
      runResult,
      waiting,
      waitErrorMessage,
      submitConfirmVisible,
      submitAnimation,
      statusMessage,
      readOnly,
      hideReportButton,
      countDown,
      notStart,
      module,
    } = this.state;
    const { TextArea } = Input;
    const assignmentInstruction:string = assignmentDescr;
    const assignmentTitle: string = assignmentName;

    const testRunAssignment = () => {
      if (!waiting) {
        this.setState({ waiting: true, waitErrorMessage: '' });
        this.submissionDocument.programCode = code;
        const waitMsg = 'Please wait...';
        this.setState({ runResult: waitMsg });
        testRun(
          testCase,
          this.submissionDocument,
          (output:string) => {
            this.setState({ runResult: output });
            this.setState({ waiting: false, waitErrorMessage: '' });
          },
        );
      } else {
        this.setState({ waitErrorMessage: 'Please wait until your test run is completed' });
      }
    };

    const submitAssignment = () => {
      this.setState({ submitAnimation: true });
      submitSubmission(this.submissionDocument, (res:AxiosResponse) => {
        if (res.status === 200) {
          this.submissionDocument = res.data;
          this.setState({
            statusMessage: 'Submission successful!',
            readOnly: true,
          });
        } else {
          this.setState({
            submitAnimation: false,
            statusMessage: `Submission Error: ${res.data}`,
            submitConfirmVisible: false,
          });
        }
      });
    };

    const { match } = this.props;
    const path = `/assignmentList/${match.userKey}/${module}`;

    if (notStart) {
      return (
        <Space direction="vertical" size="large">
          <div>
            <PageHeader
              className="site-page-header"
              title="This assignment is not available yet"
            />
            <br />
            <Button type="primary" style={{ marginLeft: 20 }}>
              <Link to={path}>Return to Assignment List</Link>
            </Button>
          </div>
        </Space>
      );
    }

    return (
      <div>
        <PageHeader
          className="site-page-header"
          title="Assignment"
        />
        <Layout>
          <Sider width="300" theme="light">
            <Space
              direction="vertical"
              size="middle"
              style={{
                display: 'flex',
              }}
            >
              <h3>
                {assignmentTitle}
              </h3>
              <h4>
                {statusMessage}
              </h4>
              <Button type="primary" hidden={hideReportButton}>
                <Link to={`/ViewReport/student/${this.submissionDocument._id}`}>View Test Report</Link>
              </Button>
              <TextArea readOnly value={assignmentInstruction} autoSize wrap="soft" />
            </Space>
          </Sider>
          <Layout>
            <Content>
              <div className="site-layout-content">
                <Button size="large">
                  <Link to={path}>Return to Assignment List</Link>
                </Button>
                <br />
                <Timer countDown={countDown} />
                <h2> Enter your solution below </h2>
                <div
                  className="code"
                  style={{
                    overflow: 'auto',
                    height: '15em',
                  }}
                >
                  <CodeEditor
                    value={code}
                    language="java"
                    placeholder="Enter your solution here."
                    onChange={(evn) => this.setState({ code: evn.target.value })}
                    padding={5}
                    readOnly={readOnly}
                    style={{
                      fontSize: 14,
                      backgroundColor: '#FFFFFF',
                      border: '1px solid',
                      fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                      overflow: 'hidden',
                      boxSizing: 'border-box',
                      minHeight: '15em',
                    }}
                  />
                </div>
                <div className="submit-panel">
                  <Row gutter={
                    {
                      xs: 4,
                      sm: 8,
                      md: 12,
                      lg: 16,
                    }
                  }
                  >
                    <Col flex="auto">
                      Test Case:
                      <br />
                      <TextArea
                        className="testCase-textArea"
                        placeholder="Enter your test case here"
                        bordered
                        readOnly={readOnly}
                        value={testCase}
                        onChange={(evn) => this.setState({ testCase: evn.target.value })}
                        rows={4}
                      />
                    </Col>
                    <Col flex="auto">
                      Test Run Output:
                      <br />
                      <TextArea
                        className="output-textArea"
                        placeholder="Output is displayed here"
                        bordered
                        readOnly
                        value={runResult}
                        rows={4}
                      />
                      <br />
                      <h4>
                        { waitErrorMessage }
                      </h4>
                    </Col>
                    <Col flex="125px">
                      <br />
                      <Space size="middle" direction="vertical">
                        <Row align="middle">
                          <Button
                            block
                            hidden={readOnly}
                            onClick={testRunAssignment}
                          >
                            Test Run
                          </Button>
                        </Row>
                        <Row align="middle">
                          <Popconfirm
                            title="Confirm to submit?"
                            visible={submitConfirmVisible}
                            onConfirm={submitAssignment}
                            okButtonProps={{
                              loading: submitAnimation,
                            }}
                            onCancel={() => { this.setState({ submitConfirmVisible: false }); }}
                          >
                            <Button
                              type="primary"
                              block
                              hidden={readOnly}
                              onClick={() => {
                                if (this.submissionDocument.status !== 'InProgress') {
                                  this.setState({ statusMessage: 'This assignment has been submitted and can no longer be modified' });
                                } else {
                                  this.setState({ submitConfirmVisible: true });
                                }
                              }}
                            >
                              Submit!
                            </Button>
                          </Popconfirm>
                        </Row>
                      </Space>
                    </Col>
                  </Row>
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}
export default App;
