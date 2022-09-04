// reference: https://blog.greenroots.info/how-to-create-a-countdown-timer-using-react-hooks#heading-the-countdown-app
import React from 'react';
import { Typography, Space } from 'antd';
import DateTimeDisplay from './timerDisplay';
import '../css/timer.css';

interface Props {
  days: any,
  hours: any,
  minutes: any,
  seconds: any,
}

function dateTimeDisplay(props:Props) {
  const {
    days,
    hours,
    minutes,
    seconds,
  } = props;
  let isDanger:boolean;
  if (days === 0 && hours === 0 && minutes <= 4) {
    isDanger = true;
  } else {
    isDanger = false;
  }
  const { Text } = Typography;
  return (
    <div className="timer">
      <Text strong>Remaining Time</Text>
      <br />
      <Space size="large">
        <DateTimeDisplay value={days} type="Days" isDanger={isDanger} />
        <DateTimeDisplay value={hours} type="Hours" isDanger={isDanger} />
        <DateTimeDisplay value={minutes} type="Mins" isDanger={isDanger} />
        <DateTimeDisplay value={seconds} type="Secs" isDanger={isDanger} />
      </Space>
    </div>
  );
}

export default dateTimeDisplay;
