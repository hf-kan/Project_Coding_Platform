import React, { useState, useEffect } from 'react';
import {
  PageHeader, Button, Input, Select,
} from 'antd';

import { addNewModule, getAllTerm } from '../../lib/adminServices';

function sendModuletoDB() {
  const message: any = { moduleId: document.getElementById('mcode'), name: document.getElementById('mname'), term: document.getElementById('term') };
  addNewModule(message);
}

function MyComponent() {
  const [termsItems, setTermItems] = useState([]);

  useEffect(() => {
    const setOptionItems = async () => {
      const output: any = [];
      getAllTerm((data:any) => {
        data.forEach((item:any) => {
          const { Option } = Select;
          output.push(<Option key={item._id} value={item._id}>{`${item.year} ${item.term}`}</Option>);
        });
        setTermItems(output);
      });
    };
    setOptionItems().catch(console.error);
  });

  const Titles: String = 'Admin Page';
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title={Titles}
      />
      <br />
      <Button style={{ marginLeft: 20 }} type="primary"> Click to add test user</Button>
      <br />
      <br />
      <Input id="mcode" placeholder="Module code" allowClear />
      <br />
      <br />
      <Input id="mname" placeholder="Module name" allowClear />
      <br />
      <br />
      <Input.Group compact>
        <Select id="term">
          {termsItems}
        </Select>
      </Input.Group>
      <br />
      <Button style={{ marginLeft: 20 }} type="primary" onClick={sendModuletoDB}>Click to add test module</Button>
    </div>
  );
}

export default MyComponent;
