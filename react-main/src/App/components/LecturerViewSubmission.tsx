// reference from: https://stackoverflow.com/questions/69302758/why-is-my-react-code-editor-component-not-highlighted-by-prismjs
import React, { Component } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import {
  PageHeader,
  Space,
  Button,
  Layout,
  Input,
} from 'antd';

import { AxiosResponse } from 'axios';

import { Link } from 'react-router-dom';

import {
  getAssignmentsByIdFiltered,
  getSubmissionById,
  getUserPersonalInfo,
  runAutoMarker,
} from '../../lib/services';

interface Props {
  match: any,
}

class App extends Component
<Props, {
  assignmentName: string,
  assignmentDescr: string,
  assignmentId: string,
  code: string,
  submitAnimation: boolean,
  statusMessage: string,
  runAutoMarkerResult: string,
  submissionStatus: string,
  score: string,
}> {
  submissionDocument: any;

  userInfo: any;

  constructor(props:Props) {
    super(props);
    this.state = {
      assignmentName: '',
      assignmentDescr: '',
      assignmentId: '',
      code: '',
      submitAnimation: false,
      statusMessage: '',
      runAutoMarkerResult: '',
      submissionStatus: '',
      score: '',
    };
    this.submissionDocument = {};
    this.userInfo = {};
  }
  // get the details of the current assignment
  // then check if first open (by checking if submission exist for current user and assignment)
  // if first open, create a new submission with status = InProgress

  componentDidMount() {
    const getData = async () => {
      const { match } = this.props;
      let submission: any;
      let assignment: any;
      getSubmissionById((match.params.key), (submissionArray:any) => {
        [submission] = submissionArray;
        this.submissionDocument = submission;
        getUserPersonalInfo((submission.userKey), (user:any) => {
          this.userInfo = user;
          getAssignmentsByIdFiltered((submission.assignmentId), (assignmentArray:any) => {
            [assignment] = assignmentArray;
            this.setState({
              assignmentName: assignment.title,
              assignmentDescr: assignment.descr,
              assignmentId: assignment._id,
              code: this.submissionDocument.programCode,
              submissionStatus: this.submissionDocument.status,
              score: this.submissionDocument.score,
            });
          });
        });
      });
    };
    getData().catch(console.error);
  }

  render() {
    const { Sider, Content } = Layout;
    const {
      assignmentName,
      assignmentDescr,
      assignmentId,
      code,
      submitAnimation,
      statusMessage,
      runAutoMarkerResult,
      submissionStatus,
      score,
    } = this.state;
    const { TextArea } = Input;
    const { userId, username, name } = this.userInfo;
    const assignmentInstruction:string = assignmentDescr;
    const assignmentTitle:string = assignmentName;
    let consoleOutput:string = '';
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title="View Submission"
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
              <Space direction="vertical">
                {`Student ID: ${userId}`}
                {`Student Name: ${name}`}
                {`Username: ${username}`}
                {`Assignment Status: ${submissionStatus}`}
                {`Score: ${score}`}
              </Space>
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
                <h2> Student Code </h2>
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
                    readOnly
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
                <br />
                <div className="submit-panel">
                  <Space>
                    <Button
                      type="primary"
                      loading={submitAnimation}
                      onClick={() => {
                        this.setState({ submitAnimation: true });
                        runAutoMarker(this.submissionDocument, (res:AxiosResponse) => {
                          if (res.status === 200) {
                            const { stdout, stderr } = res.data;
                            if (stderr === undefined || stderr === '') {
                              consoleOutput = stdout;
                            } else {
                              consoleOutput = stderr;
                            }
                            let submission:any;
                            getSubmissionById((this.submissionDocument._id), (subArray:any) => {
                              [submission] = subArray;
                              this.submissionDocument = submission;
                              this.setState({
                                submitAnimation: false,
                                statusMessage: 'Auto marker run completed',
                                runAutoMarkerResult: consoleOutput,
                                submissionStatus: submission.status,
                                score: submission.score,
                              });
                            });
                          } else {
                            const {
                              error,
                              stderr,
                              abnormalError,
                              compileError,
                              stdout,
                            } = res.data;
                            if (stderr !== undefined) {
                              consoleOutput = stderr;
                            } else if (error !== undefined) {
                              consoleOutput = error;
                            } else if (abnormalError !== undefined) {
                              consoleOutput = abnormalError;
                            } else if (compileError !== undefined) {
                              consoleOutput = compileError;
                            } else {
                              consoleOutput = stdout;
                            }
                            this.setState({
                              submitAnimation: false,
                              statusMessage: 'Auto marker run result in error',
                              runAutoMarkerResult: consoleOutput,
                            });
                          }
                        });
                      }}
                    >
                      Run Automarker
                    </Button>
                    <Button type="primary">
                      <Link to={`/ViewReport/lecturer/${this.submissionDocument._id}`}>View Test Report</Link>
                    </Button>
                    <Button type="primary">
                      View Raw Test Result
                    </Button>
                    <Button>
                      <Link to={`/ViewStudentSubmissions/${assignmentId}`}>Go Back to Submission List</Link>
                    </Button>
                  </Space>
                  <br />
                  <br />
                  Auto-marker run result:
                  <br />
                  <TextArea
                    id="autoGraderResult"
                    value={runAutoMarkerResult}
                    readOnly
                    rows={10}
                    placeholder="After running auto-marker, console output is displayed here."
                  />
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
