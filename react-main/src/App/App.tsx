// https://www.section.io/engineering-education/how-to-setup-nodejs-express-for-react/
import React, { Component } from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import './css/App.css';
import HeadPanel from './Header';
import HomepageContent from './components/HomepageContent';
import { getUserRole } from '../lib/services';
import Admin from './components/admin';
import Student from './components/StudentMain';
import Lecturer from './components/LecturerMain';
import StudentListModuleAssignment from './components/StudentListModuleAssignment';
import StudentAssignment from './components/studentAssignment';
import LecturerListModuleAssignment from './components/LecturerListModuleAssignment';
import LecturerListStudentsSubmissions from './components/LecturerListStudentsSubmissions';
import LecturerViewSubmission from './components/LecturerViewSubmission';
import AddAssignment from './components/adminAddAssignment';

const { Header, Content } = Layout;

interface Props {
  accessToken: any,
  graphData: any,
}

class App extends Component <Props, { role: string[], username: string }> {
  constructor(props:any) {
    super(props);
    this.state = {
      role: [],
      username: '',
    };
  }

  componentDidMount() {
    const getModuleData = async () => {
      const { graphData } = this.props;
      getUserRole(graphData.userPrincipalName, (userRole: string[]) => {
        this.setState({
          role: userRole,
          username: graphData.userPrincipalName,
        });
      });
    };
    getModuleData();
  }

  render() {
    const { role, username } = this.state;
    const userProps = { username };
    return (
      <Router>
        <Layout className="layout">
          <div>
            <Header
              style={{
                width: '100%',
              }}
            >
              <HeadPanel role={role} username={username} />
            </Header>
          </div>
          <Content
            className="site-layout"
          >
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
                <Route path="/assignmentList/:username/:key" component={StudentListModuleAssignment} />
                <Route path="/studentAssignment/:username/:key" component={StudentAssignment} />
                <Route path="/lecturerAssignmentList/:username/:key" component={LecturerListModuleAssignment} />
                <Route path="/ViewStudentSubmissions/:key" component={LecturerListStudentsSubmissions} />
                <Route path="/viewSubmission/:key" component={LecturerViewSubmission} />
              </Switch>
            </div>
          </Content>
        </Layout>
      </Router>
    );
  }
}

export default App;
