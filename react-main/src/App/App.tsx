// https://www.section.io/engineering-education/how-to-setup-nodejs-express-for-react/
import React, { Component } from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import './css/App.css';
import HeadPanel from './Header';
import HomepageContent from './components/HomepageContent';
import { getUserRole, getUserId } from '../lib/services';
import Admin from './components/admin';
import Student from './components/StudentMain';
import Lecturer from './components/LecturerMain';
import StudentListModuleAssignment from './components/StudentListModuleAssignment';
import StudentAssignment from './components/studentAssignment';
import LecturerListModuleAssignment from './components/LecturerListModuleAssignment';
import LecturerListStudentsSubmissions from './components/LecturerListStudentsSubmissions';
import LecturerViewSubmission from './components/LecturerViewSubmission';
import AddAssignment from './components/adminAddAssignment';
import DisplayUser from './components/DisplayUser';
import TestReport from './components/testReport';

const { Header, Content } = Layout;

interface Props {
  accessToken: any,
  graphData: any,
}

class App extends Component <Props, { role: string[], userKey: string }> {
  constructor(props:any) {
    super(props);
    this.state = {
      role: [],
      userKey: '',
    };
  }

  componentDidMount() {
    const getModuleData = async () => {
      const { graphData } = this.props;
      getUserId(graphData.userPrincipalName, (id:string) => {
        getUserRole(id, (userRole: string[]) => {
          this.setState({
            role: userRole,
            userKey: id,
          });
        });
      });
    };
    getModuleData();
  }

  render() {
    const { role, userKey } = this.state;
    const userProps = { userKey };
    return (
      <Router>
        <Layout className="layout">
          <div>
            <Header
              style={{
                width: '100%',
              }}
            >
              <HeadPanel role={role} />
            </Header>
          </div>
          <div>
            <Content
              className="site-layout"
            >
              <div className="userName">
                <DisplayUser userKey={userKey} />
              </div>
              <div
                className="site-layout-background"
                style={{
                  padding: 24,
                }}
              >
                <Switch>
                  <Route exact path="/">
                    <HomepageContent />
                  </Route>
                  <Route path="/admin">
                    <Admin />
                  </Route>
                  <Route path="/addAssignment">
                    <AddAssignment />
                  </Route>
                  <Route path="/student">
                    <Student {...userProps} />
                  </Route>
                  <Route path="/lecturer">
                    <Lecturer {...userProps} />
                  </Route>
                  <Route path="/assignmentList/:userKey/:key" component={StudentListModuleAssignment} />
                  <Route path="/studentAssignment/:userKey/:key" component={StudentAssignment} />
                  <Route path="/lecturerAssignmentList/:userKey/:key" component={LecturerListModuleAssignment} />
                  <Route path="/ViewStudentSubmissions/:key" component={LecturerListStudentsSubmissions} />
                  <Route path="/viewSubmission/:key" component={LecturerViewSubmission} />
                  <Route path="/ViewReport/:mode/:key" component={TestReport} />
                </Switch>
              </div>
            </Content>
          </div>
        </Layout>
      </Router>
    );
  }
}

export default App;
