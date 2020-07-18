import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import React, { Props, Component } from "react";
const localizer = momentLocalizer(moment);
const myEventsList: any[] = [];

type EventList = {
  myList: any[];
};

const MyCalendar: React.FC<EventList> = ({ myList }) => (
  //myEventsList = {}
  <div>
    <Calendar
      localizer={localizer}
      events={myList}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  </div>
);

export default MyCalendar;

// yarn add @types/react-big-calendar
