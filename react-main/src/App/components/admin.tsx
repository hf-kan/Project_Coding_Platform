import React, { Component } from 'react';
import {
  PageHeader, Button, Input, Select,
} from 'antd';

import { Link } from 'react-router-dom';

import { addNewModule, getAllTerm } from '../../lib/adminServices';

class App extends Component
<{}, { termItems:any[], modCode:string, modName:string, modTerm:string }> {
  constructor(props:any) {
    super(props);
    this.state = {
      termItems: [],
      modCode: '',
      modName: '',
      modTerm: '',
    };
  }

  componentDidMount() {
    const setOptionItems = async () => {
      const output: any = [];
      getAllTerm((data:any) => {
        data.forEach((item:any) => {
          const { Option } = Select;
          output.push(<Option key={item._id} value={item._id}>{`${item.year} ${item.term}`}</Option>);
        });
        this.setState({
          termItems: output,
        });
      });
    };
    setOptionItems().catch(console.error);
  }

  handleCodeChange = (event:any) => {
    this.setState({ modCode: event.target.value });
  };

  handleNameChange = (event:any) => {
    this.setState({ modName: event.target.value });
  };

  handleTermChange = (value:string) => {
    this.setState({ modTerm: value });
  };

  handleModuleSubmit = () => {
    const { modCode, modName, modTerm } = this.state;
    const message: any[] = [{
      moduleId: modCode,
      name: modName,
      term: modTerm,
    }];
    addNewModule(message);
  };

  render() {
    const {
      termItems, modCode, modName, modTerm,
    } = this.state;
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title="Admin Page"
        />
        <br />
        <Button
          style={{ marginLeft: 20 }}
          type="primary"
        >
          <Link to="/addAssignment">Add New Assignment</Link>
        </Button>
        <br />
        <br />
        <Button style={{ marginLeft: 20 }} type="primary">Add New User</Button>
        <br />
        <br />
        <Input id="mcode" value={modCode} onChange={this.handleCodeChange} placeholder="Module code" allowClear />
        <br />
        <br />
        <Input id="mname" value={modName} onChange={this.handleNameChange} placeholder="Module name" allowClear />
        <br />
        <br />
        <Input.Group compact>
          <Select id="term" value={modTerm} onChange={this.handleTermChange}>
            {termItems}
          </Select>
        </Input.Group>
        <br />
        <Button style={{ marginLeft: 20 }} type="primary" onClick={this.handleModuleSubmit}>Click to add test module</Button>
      </div>
    );
  }
}
export default App;
