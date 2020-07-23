/*users.jsx*/
import React, { useState, useEffect } from "react"; //, { Component, useState }
//You have to use the link component to link between you pages
import { RouteComponentProps } from "react-router-dom";
import gql from "graphql-tag";
// import { Query, graphql } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloProvider } from "react-apollo";
import MyCalendar from "./Moment";
import styled from "@emotion/styled";
import "react-big-calendar/lib/css/react-big-calendar.css";

import DatePicker from "react-datepicker";
//yarn add react-datepicker
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import setSeconds from "date-fns/setSeconds";
import setMinutes from "date-fns/setMinutes";
import setHours from "date-fns/setHours";

import Redirect, { withRouter } from "react-router-dom";
interface SignUpPagePropsInterface extends RouteComponentProps<{ id: string }> {
  // Other props that belong to component it self not Router
}

const cache = new InMemoryCache();

const link = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link,
});

//const id = this.props.match.params.id  ;//this.props.match.params.id;
type Host = {
  // Mistake #3: The type is wrong here, and that should be caught at compile-time
  email: string;
  firstname: string;
  lastname: string;
};

type Link = {
  link: string;
  duration: number;
  email: string;
};

const urlId: {
  urlid: string;
} = {
  urlid: "",
};

const timeSpan: {
  interval: number;
} = {
  interval: 45,
};

const CalendarCard = styled.div`
  margin: 0 auto;
  width: 1000px;
  height: 1000px;
  align-items: center;
  border-radius: 15px;
`;
const temp: any[] = [];
let interval: number;

// let handleChange = (date: any) => {
//   this.setState({
//     startDate: date,
//   });
// };

const SignUpPage: React.FC<SignUpPagePropsInterface> = (
  props: SignUpPagePropsInterface
) => {
  const id = props.match.params.id;
  urlId.urlid = id;

  const [startDate, setStartDate] = useState<Date>(
    setHours(setMinutes(new Date(), 30), 16)
  );

  const [startTime, setStartTime] = useState<Date>(
    setHours(setMinutes(new Date(), 30), 16)
  );
  const [userEmail, setUserEmail] = useState("");

  let handleColor = (time: any) => {
    return time.getHours() > 12 ? "text-success" : "text-error";
  };

  let excludeTimeDictionary: { [dateID: string]: Date[] } = {
    "2020-6-20": [
      setSeconds(setHours(setMinutes(new Date(), 0), 17), 0), // 17:00
      setHours(setMinutes(new Date(), 30), 18),
    ],
    "2020-6-22": [
      setHours(setMinutes(new Date(), 30), 19),
      setHours(setMinutes(new Date(), 30), 17),
    ],
  };
  //let excludeTimeList: Date[] = [];
  const [excludeTimeList, setExcludeTimeList] = useState<Date[]>([]);

  const [selectTime, setSelect] = useState(false);
  function handleSubmit(e: any) {
    if (!selectTime) {
      window.alert("Date is not selected");
    } else {
      e.preventDefault();

      //result contains the selected time + date
      let result = new Date();

      result.setTime(startTime.getTime()); //note time includes the month/date/year
      result.setDate(startDate.getDate());
      result.setMonth(startDate.getMonth());
      result.setFullYear(startDate.getFullYear());

      let main = startDate;
      console.log(main);

      console.log("result is: " + result);

      props.history.push("/submit-info/" + id + "/" + result.toString());
      // return <Redirect to="/404" />;
    }
  }

  function IntervalSetup() {
    const { loading, error, data } = useQuery(GET_UNIQUE_LINK, {
      variables: { id: urlId.urlid },
    });

    return loading ? (
      <div>loading</div>
    ) : error ? (
      <div>An Error occurred: {error}</div>
    ) : (
      <div className="form-group">
        <form onSubmit={handleSubmit}>
          <DatePicker
            // showTimeSelect
            selected={startDate}
            onChange={(date: Date) => {
              setStartDate(date);
              let key =
                date.getFullYear().toString() +
                "-" +
                date.getMonth().toString() +
                "-" +
                date.getDate().toString();
              console.log("mykey: " + key);
              setExcludeTimeList(excludeTimeDictionary[key]);
              //excludeTimeList = excludeTimeDictionary[key];
              console.log(excludeTimeList);
              setSelect(true);
            }}
            timeFormat="HH:mm"
            timeIntervals={data.link.duration}
            inline
          />
          {selectTime && (
            <DatePicker
              showTimeSelect
              showTimeSelectOnly
              selected={startTime}
              onChange={(date: Date) => setStartTime(date)}
              timeFormat="HH:mm"
              timeIntervals={data.link.duration}
              excludeTimes={excludeTimeList}
              inline
            />
          )}
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Select Date
            </button>
          </div>
        </form>
      </div>
    );
  }

  //interval = IntervalSetup() > 0 ? IntervalSetup() : 45;

  return (
    <ApolloProvider client={client}>
      <SignUpServer />

      <CalendarCard>
        <IntervalSetup />
      </CalendarCard>
      {/* <CalendarCard>
        <MyCalendar myList={temp} />
      </CalendarCard> */}
    </ApolloProvider>
  );
};

function SignUpServer() {
  const { loading, error, data } = useQuery(GET_UNIQUE_LINK, {
    variables: { id: urlId.urlid },
  });
  return loading ? (
    <div>loading</div>
  ) : error ? (
    <div>An Error occurred: {error}</div>
  ) : (
    <ul>
      <li>
        {data.link.link} used by {data.link.email} for {data.link.duration}
      </li>
    </ul>
  );
}

const GET_UNIQUE_LINK = gql`
  query($id: String) {
    link(id: $id) {
      email
      duration
      link
    }
  }
`;

export default SignUpPage;
