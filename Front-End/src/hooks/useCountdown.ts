import { useEffect, useState } from "react";

const useCountdown = (targetDate: any) => {
  const countDownDate = new Date(targetDate).getTime();
  const [countDown, setCountDown] = useState(
    parseInt(localStorage.getItem("countDown") ?? "0")
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = countDownDate - new Date().getTime();
      if (timeLeft <= 0) {
        clearInterval(interval);
        localStorage.setItem("countDown", "0");
        setCountDown(0);
      } else {
        localStorage.setItem("countDown", timeLeft.toString());
        setCountDown(timeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  const [days, hours, minutes, seconds] = getReturnValues(countDown);

  return [days, hours, minutes, seconds];
};

const getReturnValues = (countDown: any) => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return [days, hours, minutes, seconds];
};

export { useCountdown };
