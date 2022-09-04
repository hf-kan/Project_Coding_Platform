// reference: https://blog.greenroots.info/how-to-create-a-countdown-timer-using-react-hooks
function getTimerReturnValues(countDown:any) {
  // calculate time left
  const daysRaw = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hoursRaw = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutesRaw = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const secondsRaw = Math.floor((countDown % (1000 * 60)) / 1000);

  // Ensure no negative values
  const days = Math.max(daysRaw, 0);
  const hours = Math.max(hoursRaw, 0);
  const minutes = Math.max(minutesRaw, 0);
  const seconds = Math.max(secondsRaw, 0);

  return [days, hours, minutes, seconds];
}

export default getTimerReturnValues;
