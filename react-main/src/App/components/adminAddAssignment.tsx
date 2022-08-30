import React, { Component } from 'react';
import {
  PageHeader, Button, Input, Select, DatePicker,
} from 'antd';

import moment from 'moment';

import { addNewModule, getAllModules, getAllTerm } from '../../lib/adminServices';

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
    addNewModule(message);
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
    } = this.state;

    const { TextArea } = Input;
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title="Add new assignments"
        />
        <Input id="title" value={title} onChange={this.handleChange} placeholder="Assignment Name" allowClear />
        <br />
        <br />
        Module:
        <Input.Group compact>
          <Select id="module" value={module} onChange={this.handleModuleChange} placeholder="Please select a module here...         ">
            {moduleItems}
          </Select>
        </Input.Group>
        <br />
        <TextArea id="descr" value={descr} onChange={this.handleChange} rows={5} placeholder="Enter assignment instruction here" />
        <br />
        <br />
        { 'Start Datetime: ' }
        <DatePicker allowClear={false} id="start" value={moment(start)} showTime minuteStep={5} secondStep={60} onChange={this.handleStartChange} />
        <br />
        { 'End Datetime: ' }
        <DatePicker allowClear={false} id="end" value={moment(end)} showTime minuteStep={5} secondStep={60} onChange={this.handleEndChange} />
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
        <Button disabled style={{ marginLeft: 20 }} type="primary" onClick={this.handleAssignmentSubmit}>Click to add test module</Button>
      </div>
    );
  }
}
export default App;