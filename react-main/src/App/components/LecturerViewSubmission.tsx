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
  runAutoMarkerResult: string;
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
    } = this.state;
    const { TextArea } = Input;
    const { userId, username, name } = this.userInfo;
    const assignmentInstruction:string = assignmentDescr;
    const assignmentTitle: string = assignmentName;
    console.log(this.submissionDocument);
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
              <h5>
                {`Student ID: ${userId}`}
              </h5>
              <h5>
                {`Student Name: ${name}`}
              </h5>
              <h5>
                {`Username: ${username}`}
              </h5>
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
                            this.setState({
                              submitAnimation: false,
                              statusMessage: 'Auto marker run successfully',
                              runAutoMarkerResult: res.data,
                            });
                          } else {
                            this.setState({
                              submitAnimation: false,
                              statusMessage: 'Auto marker run result in error',
                              runAutoMarkerResult: res.data,
                            });
                          }
                        });
                      }}
                    >
                      Run Automarker
                    </Button>
                    <Button type="primary">
                      View Test Report
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
