import React, { useState, useEffect } from "react";
import { socket } from "./socket";
import moment from "moment";
// import AuthContext from '../context/auth/authContext';

const Timer = (props) => {
  // const authContext = useContext(AuthContext);
  // const { user } = authContext;
  const [timer, setTimer] = useState({
    timervalid: false,
    timer_id: 0,
    days: 0,
    seconds: 0,
    minutes: 0,
    hours: 0,
  });
  let serverTime = new Date();

  useEffect(() => {
    if (socket) {
      socket.on("auservertime", (data) => {
        if (moment(data.dTime).isValid()) {
          serverTime = new Date(data.dTime);
        }
      });
    }
  }, []);
  const getTimeRemaining = (t) => {
    var seconds = ("0" + Math.floor((t / 1000) % 60)).slice(-2);
    var minutes = ("0" + Math.floor((t / 1000 / 60) % 60)).slice(-2);
    var hours = ("0" + Math.floor((t / (1000 * 60 * 60)) % 24)).slice(-2);
    var days = 0;
    if (Math.floor(t / (1000 * 60 * 60 * 24)).toString().length >= 2) {
      days = Math.floor(t / (1000 * 60 * 60 * 24));
    } else {
      days = ("0" + Math.floor(t / (1000 * 60 * 60 * 24))).slice(-2);
    }
    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  };

  useEffect(() => {
    if (
      props.date_closed &&
      moment(props.date_closed).isValid() &&
      props.date_added &&
      moment(props.date_added).isValid()
    ) {
      const interval = setInterval(() => {
        let startDate = new Date(serverTime);
        let endDate = new Date(props.date_closed);
        let addDate = new Date(props.date_added);
        let timerTime = endDate.getTime() - startDate.getTime();
        let future = false;
        let milliSeconds = 0;
        // if (parseInt(user.role) !== 3) {
        //   milliSeconds = 1 * 3600000;
        // } else {
        // }
        let incrementedTime = addDate.getTime() + parseInt(milliSeconds);
        let newaddDate = new Date(incrementedTime);
        if (newaddDate > startDate) {
          timerTime = incrementedTime - startDate.getTime();
          future = true;
        }
        var t = getTimeRemaining(timerTime);

        if (t.total <= 0) {
          if (t.future) {
          } else {
            setTimer({
              ...timer,
              timer_id: interval,
              timervalid: false,
            });
            clearInterval(interval);
          }
        } else {
          setTimer({
            ...timer,
            timer_id: interval,
            timervalid: true,
            days: t.days,
            seconds: t.seconds,
            minutes: t.minutes,
            hours: t.hours,
            future: future,
          });
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    } else if (props.date_closed && moment(props.date_closed).isValid()) {
      const interval = setInterval(() => {
        var startDate = new Date(serverTime);
        var endDate = new Date(props.date_closed);
        var timerTime = endDate.getTime() - startDate.getTime();
        var t = getTimeRemaining(timerTime);
        if (t.total <= 0) {
          setTimer({
            ...timer,
            timer_id: interval,
            timervalid: false,
          });
          clearInterval(interval);
        } else {
          setTimer({
            ...timer,
            timer_id: interval,
            timervalid: true,
            days: t.days,
            seconds: t.seconds,
            minutes: t.minutes,
            hours: t.hours,
          });
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [props.date_closed]);
  return (
    <>
      {timer.timer_id === 0
        ? ""
        : timer.timervalid
        ? `
        ${
          props.withText === 1
            ? timer.future
              ? props.startText
                ? props.startText
                : "Starts In : "
              : props.endText
              ? props.endText
              : "Ends In : "
            : timer.future
            ? ""
            : ""
        }
        ${
          timer.days > 0
            ? timer.days + (props.daysText ? props.daysText : " D:")
            : ""
        }${timer.hours + (props.hoursText ? props.hoursText : " H:")}${
            timer.minutes + (props.minutesText ? props.minutesText : " M:")
          }${timer.seconds + (props.secondsText ? props.secondsText : " S")}`
        : "Auction Closed"}
    </>
  );
};

export default Timer;
