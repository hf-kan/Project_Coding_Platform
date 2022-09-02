import React, { Component } from 'react';
import {
  PageHeader, Button, Input, Select, DatePicker, Space,
} from 'antd';

import { Link } from 'react-router-dom';

import { AxiosResponse } from 'axios';

import moment from 'moment';

import { addNewAssignment, getAllModules, getAllTerm } from '../../lib/adminServices';

class App extends Component
<{}, {
  moduleItems:any[],
  title:string,
  module:string,
  descr:string,
  start:Date,
  end:Date,
  solution:string,
  testCase:string,
  methodName:string,
  skeletonCode:string,
  statusMsg:string;
  }> {
  constructor(props:any) {
    super(props);
    this.state = {
      moduleItems: [],
      title: '',
      module: '',
      descr: '',
      start: new Date(),
      end: new Date(),
      solution: '',
      testCase: '',
      methodName: '',
      skeletonCode: '',
      statusMsg: '',
    };
  }

  componentDidMount() {
    const setOptionItems = async () => {
      const output: any = [];
      const defaultDateTime: Date = new Date();
      const defaultDate: Date = new Date(defaultDateTime.toDateString());
      getAllModules((data:any[]) => {
        getAllTerm((termData:any[]) => {
          data.forEach((item:any) => {
            const term = termData.find(
              (tm) => tm._id === item.term,
            );
            const { Option } = Select;
            if (term !== undefined) {
              output.push(<Option key={item._id} value={item._id}>{`${item.moduleId} ${item.name} (${term.year} ${term.term})`}</Option>);
            }
          });
          this.setState({ moduleItems: output, start: defaultDate, end: defaultDate });
        });
      });
    };
    setOptionItems().catch(console.error);
  }

  handleChange = (event:any) => {
    if (event.target.id === 'title') {
      this.setState({ title: event.target.value });
    } else
    if (event.target.id === 'module') {
      this.setState({ module: event.target.value });
    } else
    if (event.target.id === 'descr') {
      this.setState({ descr: event.target.value });
    } else
    if (event.target.id === 'solution') {
      this.setState({ solution: event.target.value });
    } else
    if (event.target.id === 'testCase') {
      this.setState({ testCase: event.target.value });
    } else
    if (event.target.id === 'methodName') {
      this.setState({ methodName: event.target.value });
    } else
    if (event.target.id === 'skeletonCode') {
      this.setState({ skeletonCode: event.target.value });
    }
  };

  handleModuleChange = (value:string) => {
    this.setState({ module: value });
  };

  handleStartChange = (start:any) => {
    this.setState({ start: start.toDate() });
  };

  handleEndChange = (end:any) => {
    this.setState({ end: end.toDate() });
  };

  handleAssignmentSubmit = () => {
    const {
      title,
      module,
      descr,
      start,
      end,
      solution,
      testCase,
      methodName,
      skeletonCode,
    } = this.state;
    const message: any[] = [{
      title,
      module,
      descr,
      start,
      end,
      solution,
      testCase,
      methodName,
      skeletonCode,
    }];
    addNewAssignment(message, (res:AxiosResponse) => {
      if (res.status === 200) {
        this.setState({ statusMsg: 'Assignment added successfully' });
      } else {
        this.setState({ statusMsg: `Error while adding assignment: ${res.data}` });
      }
    });
  };

  render() {
    const {
      moduleItems,
      title,
      module,
      descr,
      start,
      end,
      solution,
      testCase,
      methodName,
      skeletonCode,
      statusMsg,
    } = this.state;

    const { TextArea } = Input;
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title="Add a new assignment"
        />
        <Input id="title" value={title} onChange={this.handleChange} placeholder="Assignment Name" allowClear />
        <br />
        <br />
        Module:
        <Input.Group>
          <Select id="module" style={{ minWidth: 500 }} value={module} onChange={this.handleModuleChange} placeholder="Select a module">
            {moduleItems}
          </Select>
        </Input.Group>
        <br />
        <TextArea id="descr" value={descr} onChange={this.handleChange} rows={5} placeholder="Enter assignment instruction here" />
        <br />
        <br />
        <Space>
          { 'Start Datetime: ' }
          <DatePicker allowClear={false} id="start" value={moment(start)} showTime minuteStep={5} secondStep={60} onChange={this.handleStartChange} />
          <br />
          { 'End Datetime: ' }
          <DatePicker allowClear={false} id="end" value={moment(end)} showTime minuteStep={5} secondStep={60} onChange={this.handleEndChange} />
        </Space>
        <br />
        <br />
        <TextArea
          id="solution"
          value={solution}
          onChange={this.handleChange}
          rows={5}
          placeholder="Enter assignment solution here, class name must be 'Solution'"
        />
        <br />
        <br />
        <TextArea
          id="testCase"
          value={testCase}
          onChange={this.handleChange}
          rows={5}
          placeholder="Enter JUnit Unit Test Class here, class name must be 'Tester'"
        />
        <br />
        <br />
        <Input
          id="methodName"
          value={methodName}
          onChange={this.handleChange}
          placeholder="Enter name of method for tester to start testing"
          allowClear
        />
        <br />
        <br />
        <TextArea
          id="skeletonCode"
          value={skeletonCode}
          onChange={this.handleChange}
          rows={5}
          placeholder="Enter Skeleton Code for students' submission class.
          Class name must be 'Submission'.
          Method name must match with method name entered above.
          Method signature must be given and matches solution method."
        />
        <br />
        <br />
        <Space size="large">
          <Button type="primary" onClick={this.handleAssignmentSubmit}>Add Assignment</Button>
          <Button><Link to="/admin">Return to Administrator page</Link></Button>
        </Space>
        <br />
        <br />
        { statusMsg }
      </div>
    );
  }
}
export default App;
