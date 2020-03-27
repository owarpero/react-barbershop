import {
  SIGN_OUT,
  DATA_CHANGED,
  DATA_TRACKING_CHANGED,
  CURRENT_TWO_WEEKS,
  TWO_WEEKS_IN_GRAPH
} from "../action";
import "firebase/auth";
import firebase from "firebase/app";
import { message } from "antd";
import { loginData } from "../login/actions";

export const signOut = payload => {
  return {
    type: SIGN_OUT,
    payload: payload
  };
};

const dateValidator = date => {
  let newDate;
  if (date === undefined) {
    newDate = new Date();
  } else {
    newDate = new Date(date);
  }
  const fullDate = `${newDate.getFullYear()}-${newDate.getMonth() +
    1}-${newDate.getDate()}`;
  const yearAndMonth = `${newDate.getFullYear()}-${newDate.getMonth() + 1}`;
  const day = `${newDate.getDate()}`;
  const month = `${newDate.getMonth() + 1}`;
  const year = `${newDate.getFullYear()}`;
  let daysInMonth;
  if (month === "2") {
    daysInMonth = 29;
  } else if (parseInt(month) % 2 === 0 && month !== 2) {
    daysInMonth = 30;
  } else {
    daysInMonth = 31;
  }
  return {
    day,
    yearAndMonth,
    fullDate,
    month,
    year,
    daysInMonth
  };
};
export const prevCurrentWeeks = dateProp => {
  let date;
  if (dateProp === undefined) {
    date = new Date();
  } else {
    date = new Date(dateProp);
  }

  let twoWeeks = [[], []];

  let startTimeOfCurrentYear = new Date(date.getFullYear(), 0, 1).getTime();
  let currentTime;
  if (date.getDay() < 4 && date.getDay() !== 0) {
    currentTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 3,
      0,
      0,
      0
    ).getTime();
  } else {
    currentTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0
    ).getTime();
  }

  let pastTimeOfStartCurrentYear = currentTime - startTimeOfCurrentYear;
  twoWeeks.push(Math.ceil(pastTimeOfStartCurrentYear / 3600000 / 168));
  let daysInMonth;

  if (date.getMonth() === 1) {
    daysInMonth = 29;
  } else if (parseInt(date.getMonth()) % 2 !== 0 && date.getMonth() !== 1) {
    daysInMonth = 30;
  } else {
    daysInMonth = 31;
  }
  twoWeeks.push(daysInMonth);
  let weekStart = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - (date.getDay() === 0 ? 7 : date.getDay()) + 1
  );
  let weekEnd = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - (date.getDay() === 0 ? 7 : date.getDay()) + 7
  );
  let prevWeekStart = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - (date.getDay() === 0 ? 7 : date.getDay()) - 6
  );
  let prevWeekEnd = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - (date.getDay() === 0 ? 7 : date.getDay())
  );
  for (let start = weekStart.getDate(); twoWeeks[1].length < 7; start++) {
    let dataFor = new Date(date.getFullYear(), weekStart.getMonth(), start);
    dataFor !== weekEnd.getDate()
      ? twoWeeks[1].push({
          day: dataFor.getDate(),
          yearAndMonth: `${dataFor.getFullYear()}-${dataFor.getMonth()}`
        })
      : twoWeeks[1].push({
          day: dataFor.getDate(),
          yearAndMonth: `${dataFor.getFullYear()}-${dataFor.getMonth()}`
        });
  }
  for (let start = prevWeekStart.getDate(); twoWeeks[0].length < 7; start++) {
    let dataFor = new Date(date.getFullYear(), prevWeekStart.getMonth(), start);
    dataFor.getDate() !== prevWeekEnd.getDate()
      ? twoWeeks[0].push({
          day: dataFor.getDate(),
          yearAndMonth: `${dataFor.getFullYear()}-${dataFor.getMonth()}`
        })
      : twoWeeks[0].push({
          day: dataFor.getDate(),
          yearAndMonth: `${dataFor.getFullYear()}-${dataFor.getMonth()}`
        });
  }
  twoWeeks.push(dateValidator(date));
  if (dateProp === undefined) {
    return {
      type: CURRENT_TWO_WEEKS,
      twoWeeks
    };
  } else {
    return {
      type: TWO_WEEKS_IN_GRAPH,
      twoWeeks
    };
  }
};

export const dataChanged = date => {
  const currentWeek = prevCurrentWeeks(date).twoWeeks;
  const data = dateValidator(date);
  return {
    type: DATA_CHANGED,
    date: {
      ...data,
      ...currentWeek
    }
  };
};
export const dataTrackingChanged = date => {
  const currentWeek = prevCurrentWeeks(date).twoWeeks;
  const data = dateValidator(date);
  return {
    type: DATA_TRACKING_CHANGED,
    date: {
      ...data,
      ...currentWeek
    }
  };
};
export const currentUserSignOut = history => dispatch => {
  firebase
    .auth()
    .signOut()
    .then(function() {
      message.success("Sing out success!");
      localStorage.removeItem("currentUser");
      dispatch(loginData(false));
      history.push("/login");
    })
    .catch(function(error) {
      message.error(error);
    });
};
