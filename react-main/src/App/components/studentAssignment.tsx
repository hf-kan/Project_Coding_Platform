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
  getAssignmentsStartEnd,
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
  expiredBeforeStart:boolean,
  module:any,
  submitMessage:string,
  reloadConfirmVisible:boolean,
  loading:boolean,
}> {
  submissionDocument: any;

  skeletonCode: any;

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
      expiredBeforeStart: false,
      module: '',
      submitMessage: '',
      reloadConfirmVisible: false,
      loading: true,
    };
    this.submissionDocument = {};
    this.skeletonCode = '';
    this.timer = () => {
      // this timer is not loaded if assignment is not available yet
      const { expiredBeforeStart, end } = this.state;
      // get Datetime from backend server to prevent cheating by altering local datetime
      getCurrentDateTime((curr:any) => {
        const currDate:Date = new Date(curr);
        const count:number = end.getTime() - currDate.getTime();
        if (count <= 0) {
          if (!expiredBeforeStart) {
            // trigger autosave when time is up
            // do not trigger if the assignment has expired already when first loading the page
            const { code } = this.state;
            this.submissionDocument.programCode = code;
            submitSubmission(this.submissionDocument, (res:AxiosResponse) => {
              if (res.status === 200) {
                this.submissionDocument = res.data;
                this.setState({
                  countDown: 0,
                  statusMessage: 'Time is up, your solution has been automatically submitted',
                  readOnly: true,
                });
              } else {
                this.setState({
                  countDown: 0,
                  statusMessage: `Time is up, but submission failed: ${res.data}`,
                  readOnly: true,
                });
              }
            });
          } else {
            // set page to read only for expired assignments
            this.setState({
              countDown: 0,
              readOnly: true,
            });
          }
        } else {
          // enable page interaction when assignment is open for submission
          this.setState({
            countDown: count,
            readOnly: false,
            statusMessage: '',
            hideReportButton: true,
            loading: false,
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
      let startEnd: any;
      let submissionFromDB: any[] = [];
      let statusMessage:string = '';
      let hideReportButton:boolean = true;
      getAssignmentsStartEnd((match.params.key), (startEndArray:any) => {
        [startEnd] = startEndArray;
        const start:Date = new Date(startEnd.start);
        const end:Date = new Date(startEnd.end);
        getCurrentDateTime((curr:any) => {
          const currDate:Date = new Date(curr);
          let expired: boolean;
          if (currDate >= end) {
            expired = true;
          } else {
            expired = false;
          }
          if (currDate >= start) {
            // load assignment details
            getAssignmentsByIdFiltered((match.params.key), (assignmentArray:any) => {
              [assignment] = assignmentArray;
              // not loading almost anything to state if the assignment hasn't started yet
              this.skeletonCode = assignment.skeletonCode;
              this.setState({
                assignmentName: assignment.title,
                assignmentDescr: assignment.descr,
                start,
                end,
                notStart: false,
                expiredBeforeStart: expired,
                module: assignment.module,
              });
              const intervalId = setInterval(this.timer, 1000);
              this.setState({ intervalId });
              getSubmissionsByUserAssignment(
                // try to load students' submission
                (match.params.userKey),
                (match.params.key),
                (arrayOfSubmissions:any[]) => {
                  if (arrayOfSubmissions.length === 0 && !expired) {
                    // No existing submission, create a submission in database
                    // and load skeleton code
                    // only if the assignment is not expired
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
                  } else if (arrayOfSubmissions.length !== 0 && !expired) {
                    // submission already exists
                    // update lastupdatedtm only and load skeleton code if code is empty
                    // only if the assignment is not expired
                    [submissionFromDB] = arrayOfSubmissions;
                    this.submissionDocument = submissionFromDB;
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
                    // assignment already expired
                    // still load skeleton code even if there is no submission
                    let programCode:string = assignment.skeletonCode;
                    if (arrayOfSubmissions.length !== 0) {
                      [submissionFromDB] = arrayOfSubmissions;
                      this.submissionDocument = submissionFromDB;
                      programCode = this.submissionDocument.programCode;
                      if (this.submissionDocument.status === 'Graded') {
                        statusMessage = 'This assignment has been graded. Click on the button to view report';
                        hideReportButton = false;
                      } else if (this.submissionDocument.status === 'Submitted' || this.submissionDocument.status === 'InProgress') {
                        // InProgress is also treated as submitted if time is up
                        statusMessage = 'This assignment has been submitted. Pending for grading';
                      } else {
                        // any other status
                        statusMessage = 'This assignment is closed';
                      }
                    } else {
                      // No submission found
                      statusMessage = 'This assignment is closed';
                    }
                    this.setState({
                      code: programCode,
                      statusMessage,
                      hideReportButton,
                      loading: false,
                    });
                  }
                },
              );
            });
          } else {
            this.setState({
              // assignment not started
              // only load module for redirection button and start datetime for display
              module: startEnd.module,
              start,
              loading: false,
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
      start,
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
      submitMessage,
      reloadConfirmVisible,
      loading,
    } = this.state;
    const { TextArea } = Input;
    const assignmentInstruction:string = assignmentDescr;
    const assignmentTitle: string = assignmentName;

    const testRunAssignment = () => {
      if (!waiting) {
        this.setState({ waiting: true, waitErrorMessage: '' });
        this.submissionDocument.programCode = code;
        const waitMsg = 'Test Run has started, please wait for your output...';
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
      this.submissionDocument.programCode = code;
      submitSubmission(this.submissionDocument, (res:AxiosResponse) => {
        const currDateTime:string = new Date().toLocaleString();
        if (res.status === 200) {
          this.submissionDocument = res.data;
          this.setState({
            submitAnimation: false,
            submitMessage: `Solution submitted at: ${currDateTime}`,
            submitConfirmVisible: false,
          });
        } else {
          this.setState({
            submitAnimation: false,
            submitMessage: `Submission failed: ${res.data}`,
            submitConfirmVisible: false,
          });
        }
      });
    };

    const { match } = this.props;
    const path = `/assignmentList/${match.params.userKey}/${module}`;

    if (loading) {
      return (
        <div>
          <PageHeader
            className="site-page-header"
            title="Loading Assignment..."
          />
          <Button size="large" style={{ marginLeft: '20px' }}>
            <Link to={path}>Return to Assignment List</Link>
          </Button>
          <br />
        </div>
      );
    }

    // Display for loading an assignment that is not started yet
    if (notStart) {
      return (
        <Space direction="vertical" size="large">
          <div>
            <PageHeader
              className="site-page-header"
              title="This assignment is not available yet"
            />
            <p style={{ marginLeft: '20px' }}>
              {'This assignment will be available at: '}
              <b>{`${start.toLocaleString()}`}</b>
            </p>
            <Button type="primary" style={{ marginLeft: 20 }}>
              <Link to={path}>Return to Assignment List</Link>
            </Button>
          </div>
        </Space>
      );
    }

    // Display of main assignment page (only if it is open or expired)
    return (
      <div>
        <Layout>
          <Sider width="300" theme="light">
            <Space
              direction="vertical"
              size="middle"
              style={{
                display: 'flex',
              }}
            >
              <PageHeader
                className="site-page-header"
                title="Assignment (Java)"
              />
              <h3>
                {assignmentTitle}
              </h3>
              <h4>
                {statusMessage}
              </h4>
              <Button type="primary" hidden={hideReportButton}>
                <Link to={`/ViewReport/student/${match.params.userKey}/${this.submissionDocument._id}`}>View Test Report</Link>
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
                <Space size="large">
                  <h2> Enter your solution below </h2>
                  <Popconfirm
                    title="Confirm to reload?"
                    okText="Yes"
                    placement="rightBottom"
                    cancelButtonProps={{ size: 'middle' }}
                    visible={reloadConfirmVisible}
                    onConfirm={() => {
                      this.setState({ code: this.skeletonCode, reloadConfirmVisible: false });
                    }}
                    okButtonProps={{
                      size: 'middle',
                      loading: submitAnimation,
                    }}
                    onCancel={() => { this.setState({ reloadConfirmVisible: false }); }}
                  >
                    <Button
                      hidden={readOnly}
                      onClick={() => {
                        this.setState({ reloadConfirmVisible: true });
                      }}
                    >
                      Reload Skeleton Code
                    </Button>
                  </Popconfirm>
                </Space>
                <div
                  className="code"
                  style={{
                    overflow: 'auto',
                    height: '26em',
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
                      minHeight: '25em',
                    }}
                  />
                </div>
                <p>{submitMessage}</p>
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
                      Enter your input for Test Run:
                      <br />
                      <TextArea
                        className="testCase-textArea"
                        placeholder="Enter your inputs here, separate each parameter input with a comma. E.g.: 1,2,3,4,5"
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
                            size="large"
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
                            okText="Submit"
                            placement="leftBottom"
                            cancelButtonProps={{ size: 'middle' }}
                            visible={submitConfirmVisible}
                            onConfirm={submitAssignment}
                            okButtonProps={{
                              size: 'middle',
                              loading: submitAnimation,
                            }}
                            onCancel={() => { this.setState({ submitConfirmVisible: false }); }}
                          >
                            <Button
                              type="primary"
                              size="large"
                              block
                              hidden={readOnly}
                              onClick={() => {
                                this.setState({ submitConfirmVisible: true });
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
