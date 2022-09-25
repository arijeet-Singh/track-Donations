import React from "react";

function DateAndTime(props) {
  let date = new Date(props.time * 1000);
  date = date.toLocaleString("en-UK", { hour12: true });
  return <>{date}</>;
}
export default DateAndTime;
