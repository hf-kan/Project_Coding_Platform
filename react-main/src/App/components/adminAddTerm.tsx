import React, { Component } from 'react';
import {
  PageHeader, Button, Input, Space, DatePicker,
} from 'antd';

import { Link } from 'react-router-dom';

import { AxiosResponse } from 'axios';

import moment from 'moment';

import { addNewTerm } from '../../lib/adminServices';

class App extends Component
<{}, {
  year:string
  term:string,
  startdate:Date,
  enddate:Date,
  statusMsg:string,
}> {
  constructor(props:any) {
    super(props);
    this.state = {
      year: '',
      term: '',
      startdate: new Date(),
      enddate: new Date(),
      statusMsg: '',
    };
  }

  handleYearChange = (event:any) => {
    this.setState({ year: event.target.value });
  };

  handleTermChange = (event:any) => {
    this.setState({ term: event.target.value });
  };

  handleStartChange = (start:any) => {
    this.setState({ startdate: start.toDate() });
  };

  handleEndChange = (end:any) => {
    this.setState({ enddate: end.toDate() });
  };

  handleTermSubmit = () => {
    const {
      year,
      term,
      startdate,
      enddate,
    } = this.state;
    const message: any[] = [{
      year,
      term,
      startdate,
      enddate,
    }];
    addNewTerm(message, (res:AxiosResponse) => {
      if (res.status === 200) {
        this.setState({ statusMsg: 'Term added successfully' });
      } else {
        this.setState({ statusMsg: `Error while adding term: ${res.data}` });
      }
    });
  };

  render() {
    const {
      year,
      term,
      startdate,
      enddate,
      statusMsg,
    } = this.state;
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title="Add a new Term"
        />
        <Space style={{ marginLeft: '20px', minWidth: '750px' }} size="small" direction="vertical">
          Year:
          <Input id="year" style={{ maxWidth: '500px' }} value={year} onChange={this.handleYearChange} placeholder="Term year (E.g.: 2022)" allowClear />
          Term:
          <Input id="term" style={{ maxWidth: '500px' }} value={term} onChange={this.handleTermChange} placeholder="Term (E.g.: Semester 1)" allowClear />
          <br />
          <Space>
            { 'Term Start: ' }
            <DatePicker allowClear={false} id="start" value={moment(startdate)} onChange={this.handleStartChange} />
            <br />
            { 'Term End: ' }
            <DatePicker allowClear={false} id="end" value={moment(enddate)} onChange={this.handleEndChange} />
          </Space>
          <br />
          <Space size="large">
            <Button type="primary" onClick={this.handleTermSubmit}>Add Term</Button>
            <Button><Link to="/admin">Return to Administrator page</Link></Button>
          </Space>
          { statusMsg }
        </Space>
      </div>
    );
  }
}
export default App;
