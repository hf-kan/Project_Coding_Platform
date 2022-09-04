// reference: https://blog.greenroots.info/how-to-create-a-countdown-timer-using-react-hooks#heading-the-countdown-app
import React from 'react';
import ShowCounter from './timerShowDisplay';
import getTimerReturnValues from './timerReturnValues';

interface Props {
  countDown: any,
}

function MyComponent(props:Props) {
  const { countDown } = props;
  const [days, hours, minutes, seconds] = getTimerReturnValues(countDown);

  if (days + hours + minutes + seconds <= 0) {
    return (
      <div />
    );
  }
  return (
    <ShowCounter
      days={days}
      hours={hours}
      minutes={minutes}
      seconds={seconds}
    />
  );
}

export default MyComponent;
