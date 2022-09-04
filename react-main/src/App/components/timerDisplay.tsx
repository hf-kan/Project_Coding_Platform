// reference: https://blog.greenroots.info/how-to-create-a-countdown-timer-using-react-hooks#heading-the-countdown-app
import React from 'react';
import { Typography, Space } from 'antd';

interface Props {
  value: any,
  type: any,
  isDanger: boolean,
}

function dateTimeDisplay(props:Props) {
  const { value, type, isDanger } = props;
  const { Text } = Typography;
  let styleType:any;
  if (isDanger) {
    styleType = 'danger';
  } else {
    styleType = '';
  }
  if (type === 'Days' && value <= 0) {
    return (<Space />);
  }
  return (
    <Space>
      <Text strong type={styleType}>{`${value}`}</Text>
      <Text type="secondary">{`${type}`}</Text>
    </Space>
  );
}

export default dateTimeDisplay;
