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

import logo from "./img/meetingGroundLogo.png";

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

const LogoCard = styled.img`
  width: 450px;
  height: 100px;
  justify-content: space-around;
  float: left;
`;

const TopFormat = styled.div`
  margin: 0 auto;
  width: 100%;
  overflow: auto;
  display: inline-block;
  background: white;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const MainBodyFormat = styled.div`
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  background: white;
  display: flex;
  flex-direction: column;
  height: 650px;
  border-radius: 25px;
`;

const temp: any[] = [];
let interval: number;

// let handleChange = (date: any) => {
//   this.setState({
//     startDate: date,
//   });
// };

type DictionaryItem = {
  dateKey: string;
  values: Date[];
};

const excludeQuery = gql`
  query($link: String) {
    list_available_slots(url: $link)
  }
`;

function useEvents(link: string) {
  const { loading, error, data } = useQuery<{ events: DictionaryItem[] }>(
    excludeQuery,
    { variables: { link } }
  );
  const events = data?.events;

  return { loading, error, events };
}

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
  //const [interval, setInterval] = useState(45);
  const [userEmail, setUserEmail] = useState("");

  let handleColor = (time: any) => {
    return time.getHours() > 12 ? "text-success" : "text-error";
  };

  const [excludeTimeDictionary, setExcludeTimeDictionary] = useState<
    DictionaryItem[]
  >([
    {
      dateKey: "2020-6-20",
      values: [
        setSeconds(setHours(setMinutes(new Date(), 0), 17), 0), // 17:00
        setHours(setMinutes(new Date(), 30), 18),
      ],
    },
    {
      dateKey: "2020-6-22",
      values: [
        setHours(setMinutes(new Date(), 30), 19),
        setHours(setMinutes(new Date(), 30), 17),
      ],
    },
  ]);
  //setExcludeTimeDictionary();
  //let excludeTimeList: Date[] = [];
  const [excludeTimeList, setExcludeTimeList] = useState<Date[]>([]);

  //TODO: BELOW IS FOR WHEN DATABASE IS CONNECTED
  // function useEvents(linkCode: string) {
  //     return useQuery(GetEventsQuery, variable: { linkCode } );
  // }

  // function useEvents(linkCode: string) {
  //   return {
  //     loading: false,
  //     error: null,
  //     events: excludeTimeDictionary,
  //   };
  // }

  type ShowSlotsProps = {
    linkCode: string;
    data: any;
  };

  function ShowSlots(showSlotInfo: ShowSlotsProps) {
    //{ linkCode }: ShowSlotsProps
    const { loading, error, events } = useEvents(showSlotInfo.linkCode);
    return loading ? (
      <div>loading</div>
    ) : error ? (
      <div>An Error occurred: {error}</div>
    ) : (
      <div
        className="form-group"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <DatePicker
          selected={startDate}
          onChange={(date: Date) => {
            setStartDate(date);
            const key = formatDate(date);

            console.log("mykey: " + key);
            //TODO: change setExcludeTimeList to get from server query

            let tempDictionaryItem = events?.find(
              (item) => item.dateKey === key
            );
            if (tempDictionaryItem !== undefined) {
              setExcludeTimeList(tempDictionaryItem.values);
            }
            console.log(excludeTimeList);
            setSelect(true);
          }}
          timeFormat="HH:mm"
          timeIntervals={showSlotInfo.data.link.duration}
          inline
        />
        {selectTime && (
          <DatePicker
            showTimeSelect
            showTimeSelectOnly
            selected={startTime}
            onChange={(date: Date) => setStartTime(date)}
            timeFormat="HH:mm"
            timeIntervals={showSlotInfo.data.link.duration}
            excludeTimes={excludeTimeList}
            inline
          />
        )}
      </div>
    );
  }

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

  const formatDate = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  function IntervalSetup() {
    const { loading, error, data } = useQuery(GET_UNIQUE_LINK, {
      variables: { id: urlId.urlid },
    });

    return loading ? (
      <div>loading</div>
    ) : error ? (
      <div>An Error occurred: {error}</div>
    ) : (
      <body style={{ background: "rgba(131, 196, 197)" }}>
        <div style={{ padding: "1rem" }}>
          <TopFormat>
            <LogoCard id="logo" src={logo} alt="Meeting Ground Logo" />
            <div
              style={{
                justifyContent: "center",
                alignContent: "center",
                display: "flex",
                flexDirection: "row",
                borderTop: "5px solid grey",
                margin: 5,
              }}
            >
              <h1
                style={{
                  // position: "relative",
                  margin: 0,
                  // float: "left",
                  // left: "15%",
                  justifyContent: "center",
                  top: 20,
                }}
              >
                Signup Page
              </h1>
            </div>
          </TopFormat>

          <MainBodyFormat>
            <h1 style={{ top: 10, margin: 20 }}>
              Sign up for your {data.link.duration} minute meeting.
            </h1>
            <h2 style={{ margin: 20 }}>Select the date, then the time.</h2>
            <div className="form-group">
              <form onSubmit={handleSubmit}>
                <ShowSlots linkCode={urlId.urlid} data={data} />

                <div
                  className="form-group"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <button type="submit" className="btn btn-primary">
                    Select Date
                  </button>
                </div>
              </form>
            </div>
          </MainBodyFormat>
        </div>
      </body>
    );
  }

  //interval = IntervalSetup() > 0 ? IntervalSetup() : 45;

  return (
    <ApolloProvider client={client}>
      {/* <SignUpServer /> */}

      <IntervalSetup />

      {/* <CalendarCard>
        <IntervalSetup />
      </CalendarCard> */}
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
