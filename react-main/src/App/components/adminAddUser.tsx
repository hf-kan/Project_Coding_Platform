import React, { Component } from 'react';
import {
  PageHeader, Button, Input, Space, Select, Checkbox, Typography,
} from 'antd';

import { Link } from 'react-router-dom';

import { AxiosResponse } from 'axios';

import { addNewUser, getAllModules, getAllTerm } from '../../lib/adminServices';

import { getUserId } from '../../lib/services';

class App extends Component
<{}, {
  username: string,
  userId: string,
  name: string,
  role: any[],
  lecturerMod: any[],
  studentMod: any[],
  moduleItem: any[],
  displayLecturerMod: boolean,
  displayStudentMod: boolean,
  statusMsg: string,
}> {
  constructor(props:any) {
    super(props);
    this.state = {
      username: '',
      userId: '',
      name: '',
      role: [],
      lecturerMod: [],
      studentMod: [],
      moduleItem: [],
      displayLecturerMod: false,
      displayStudentMod: false,
      statusMsg: '',
    };
  }

  componentDidMount() {
    const setOptionItems = async () => {
      const output: any = [];
      getAllModules((data:any[]) => {
        getAllTerm((termData:any[]) => {
          data.forEach((item:any) => {
            const term = termData.find(
              (tm) => tm._id === item.term,
            );
            if (term !== undefined) {
              output.push({ label: `${item.moduleId} ${item.name} (${term.year} ${term.term})`, value: item._id });
            }
          });
          this.setState({ moduleItem: output });
        });
      });
    };
    setOptionItems().catch(console.error);
  }

  handleChange = (event:any) => {
    if (event.target.id === 'username') {
      this.setState({ username: event.target.value });
    } else
    if (event.target.id === 'userId') {
      this.setState({ userId: event.target.value });
    } else
    if (event.target.id === 'name') {
      this.setState({ name: event.target.value });
    }
  };

  handleRoleChange = (checkedValues:any[]) => {
    const displayLecturerMod: boolean = checkedValues.find((element:string) => element === 'lecturer');
    const displayStudentMod: boolean = checkedValues.find((element:string) => element === 'student');
    this.setState({ displayLecturerMod, displayStudentMod, role: checkedValues });
  };

  handleUserSubmit = () => {
    const {
      username,
      userId,
      name,
      role,
      lecturerMod,
      studentMod,
    } = this.state;
    const message: any[] = [{
      username,
      userId,
      name,
      role,
      lecturerMod,
      studentMod,
    }];
    getUserId(username, (output:any) => {
      if (output !== undefined) {
        this.setState({ statusMsg: 'Error: This account username (email address) already exists in database!' });
      } else {
        addNewUser(message, (res:AxiosResponse) => {
          if (res.status === 200) {
            this.setState({ statusMsg: 'User added successfully' });
          } else {
            this.setState({ statusMsg: `Error while adding user: ${res.data}` });
          }
        });
      }
    });
  };

  render() {
    const {
      username,
      userId,
      name,
      lecturerMod,
      studentMod,
      moduleItem,
      displayLecturerMod,
      displayStudentMod,
      statusMsg,
    } = this.state;

    const { Title, Text } = Typography;

    const roleItem = [
      {
        label: 'Administrator',
        value: 'admin',
      },
      {
        label: 'Lecturer',
        value: 'lecturer',
      },
      {
        label: 'Student',
        value: 'student',
      },
    ];

    const lecturerModProps:any = {
      mode: 'multiple',
      hidden: !displayLecturerMod,
      style: {
        width: '750px',
      },
      value: lecturerMod,
      options: moduleItem,
      onChange: (newValue:any[]) => {
        this.setState({ lecturerMod: newValue });
      },
      placeholder: 'Select modules',
      maxTagCount: 'responsive',
    };

    const studentModProps:any = {
      mode: 'multiple',
      hidden: !displayStudentMod,
      style: {
        width: '750px',
      },
      value: studentMod,
      options: moduleItem,
      onChange: (newValue:any[]) => {
        this.setState({ studentMod: newValue });
      },
      placeholder: 'Select modules',
      maxTagCount: 'responsive',
    };

    return (
      <div>
        <PageHeader
          className="site-page-header"
          title="Add a new User"
        />
        <Space style={{ marginLeft: '20px', minWidth: '750px' }} size="small" direction="vertical">
          Account Username (Email Address):
          <Input id="username" value={username} onChange={this.handleChange} placeholder="Enter the user's email address" allowClear />
          Student ID / Staff ID:
          <Input id="userId" value={userId} onChange={this.handleChange} placeholder="Enter the user's ID" allowClear />
          Full Name:
          <Input id="name" value={name} onChange={this.handleChange} placeholder="Enter the user's full name" allowClear />
          Select Role(s):
          <Checkbox.Group options={roleItem} onChange={this.handleRoleChange} />
          <br />
          <Title level={5}>Modules Enrollment</Title>
          <Text>
            Select module(s) to enroll to Lecturer Role (only visible if role is selected):
          </Text>
          <Select {...lecturerModProps} />
          <Text>
            Select module(s) to enroll to Student Role (only visible if role is selected):
          </Text>
          <Select {...studentModProps} />
          <br />
          <Space size="large">
            <Button type="primary" onClick={this.handleUserSubmit}>Add User</Button>
            <Button><Link to="/admin">Return to Administrator page</Link></Button>
          </Space>
          {statusMsg}
        </Space>
      </div>
    );
  }
}
export default App;
