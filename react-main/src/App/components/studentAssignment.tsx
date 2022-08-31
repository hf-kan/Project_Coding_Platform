// reference from: https://stackoverflow.com/questions/69302758/why-is-my-react-code-editor-component-not-highlighted-by-prismjs
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

import { AxiosResponse } from 'axios';

import {
  getAssignmentsByIdFiltered,
  getSubmissionsByUserAssignment,
  addSubmission,
  updateSubmission,
  submitSubmission,
} from '../../lib/services';

import testRun from './testRunSubmission';

interface Props {
  match: any,
}

class App extends Component
<Props, {
  assignmentName: string,
  assignmentDescr: string,
  code: string,
  testCase:string,
  runResult: string,
  waiting: boolean,
  waitErrorMessage: string,
  submitConfirmVisible: boolean,
  submitAnimation: boolean,
  statusMessage: string,
  readOnly: boolean;
}> {
  submissionDocument: any;

  constructor(props:Props) {
    super(props);
    this.state = {
      assignmentName: '',
      assignmentDescr: '',
      code: '',
      testCase: '',
      runResult: '',
      waiting: false,
      waitErrorMessage: '',
      submitConfirmVisible: false,
      submitAnimation: false,
      statusMessage: '',
      readOnly: false,
    };
    this.submissionDocument = {};
  }
  // get the details of the current assignment
  // then check if first open (by checking if submission exist for current user and assignment)
  // if first open, create a new submission with status = InProgress

  componentDidMount() {
    const getAssignmentData = async () => {
      const { match } = this.props;
      let assignment: any;
      let submissionFromDB: any[] = [];
      getAssignmentsByIdFiltered((match.params.key), (assignmentArray:any) => {
        // load assignment details
        [assignment] = assignmentArray;
        getSubmissionsByUserAssignment(
          // try to load students' submission
          (match.params.userKey),
          (match.params.key),
          (arrayOfSubmissions:any[]) => {
            if (arrayOfSubmissions.length === 0) {
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
                  assignmentName: assignment.title,
                  assignmentDescr: assignment.descr,
                  code: this.submissionDocument.programCode,
                });
              });
            } else {
              [submissionFromDB] = arrayOfSubmissions;
              this.submissionDocument = submissionFromDB;
              if (this.submissionDocument.status === 'InProgress') {
                // In Progress submission already exist,
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
                    assignmentName: assignment.title,
                    assignmentDescr: assignment.descr,
                    code: this.submissionDocument.programCode,
                  });
                });
              } else {
                // submission has been submitted
                this.setState({
                  assignmentName: assignment.title,
                  assignmentDescr: assignment.descr,
                  code: this.submissionDocument.programCode,
                  statusMessage: 'This assignment has been submitted and can no longer be modified',
                  readOnly: true,
                });
              }
            }
          },
        );
      });
    };
    getAssignmentData().catch(console.error);
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
    } = this.state;
    const { TextArea } = Input;
    const assignmentInstruction:string = assignmentDescr;
    const assignmentTitle: string = assignmentName;
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
              <TextArea readOnly value={assignmentInstruction} autoSize wrap="soft" />
            </Space>
          </Sider>
          <Layout>
            <Content>
              <div className="site-layout-content">
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
                            disabled={readOnly}
                            onClick={() => {
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
                            }}
                          >
                            Test Run
                          </Button>
                        </Row>
                        <Row align="middle">
                          <Popconfirm
                            title="Confirm to submit?"
                            visible={submitConfirmVisible}
                            onConfirm={() => {
                              this.setState({ submitAnimation: true });
                              this.submissionDocument.programCode = code;
                              submitSubmission(this.submissionDocument, (res:AxiosResponse) => {
                                if (res.status === 200) {
                                  this.submissionDocument = res.data;
                                  this.setState({
                                    submitAnimation: false,
                                    statusMessage: 'Submission successful! You may now leave this page',
                                    submitConfirmVisible: false,
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
                            }}
                            okButtonProps={{
                              loading: submitAnimation,
                            }}
                            onCancel={() => { this.setState({ submitConfirmVisible: false }); }}
                          >
                            <Button
                              type="primary"
                              block
                              disabled={readOnly}
                              onClick={() => {
                                if (this.submissionDocument.status !== 'InProgress') {
                                  this.setState({ statusMessage: 'This assignment has already been submitted, no further submissions allowed' });
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
