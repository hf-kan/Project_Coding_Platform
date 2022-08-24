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
import StudentListModuleAssignment from './components/StudentListModuleAssignment';

const { Header, Content } = Layout;

class App extends Component <{}, { role: string[], username: string }> {
  constructor(props:any) {
    super(props);
    this.state = {
      role: [],
      username: '',
    };
  }

  componentDidMount() {
    getUserRole('andykan016@gmail.com', (userRole: string[]) => {
      this.setState({
        role: userRole,
        username: 'andykan016@gmail.com',
      });
    });
  }

  render() {
    const { role, username } = this.state;
    const studentProps = { username };
    return (
      <Router>
        <Layout className="layout">
          <Header
            style={{
              position: 'fixed',
              width: '100%',
            }}
          >
            <HeadPanel role={role} />
          </Header>
          <Content
            className="site-layout"
            style={{
              marginTop: 64,
            }}
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
                <Route path="/student">
                  <Student {...studentProps} />
                </Route>
                <Route path="/assignmentList/:key" component={StudentListModuleAssignment} />
              </Switch>
            </div>
          </Content>
        </Layout>
      </Router>
    );
  }
}
// render={(routeProps) => (<StudentListModuleAssignment {...routeProps} />)}
export default App;
