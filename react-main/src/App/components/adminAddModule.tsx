import React, { Component } from 'react';
import {
  PageHeader, Button, Input, Select, Space,
} from 'antd';

import { Link } from 'react-router-dom';

import { AxiosResponse } from 'axios';

import { addNewModule, getAllTerm } from '../../lib/adminServices';

class App extends Component
<{}, {
  termItems:any[],
  modCode:string,
  modName:string,
  modTerm:string,
  statusMsg:string,
}> {
  constructor(props:any) {
    super(props);
    this.state = {
      termItems: [],
      modCode: '',
      modName: '',
      modTerm: '',
      statusMsg: '',
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
    addNewModule(message, (res:AxiosResponse) => {
      if (res.status === 200) {
        this.setState({ statusMsg: 'Module added successfully' });
      } else {
        this.setState({ statusMsg: `Error while adding module: ${res.data}` });
      }
    });
  };

  render() {
    const {
      termItems, modCode, modName, modTerm, statusMsg,
    } = this.state;
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title="Add a new Module"
        />
        <Space style={{ marginLeft: '20px', minWidth: '750px' }} size="small" direction="vertical">
          Module Code:
          <Input id="mcode" style={{ maxWidth: '500px' }} value={modCode} onChange={this.handleCodeChange} placeholder="Module code" allowClear />
          Module Name:
          <Input id="mname" style={{ maxWidth: '1000px' }} value={modName} onChange={this.handleNameChange} placeholder="Module name" allowClear />
          Select Academic Term:
          <Input.Group compact>
            <Select id="term" style={{ minWidth: 500 }} value={modTerm} onChange={this.handleTermChange}>
              {termItems}
            </Select>
          </Input.Group>
          <br />
          <Space size="large">
            <Button type="primary" onClick={this.handleModuleSubmit}>Add Module</Button>
            <Button><Link to="/admin">Return to Administrator page</Link></Button>
          </Space>
          <br />
          { statusMsg }
        </Space>
      </div>
    );
  }
}
export default App;
