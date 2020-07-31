/*users.jsx*/
import React, { useState, useEffect } from "react"; //, { Component, useState }
//You have to use the link component to link between you pages
import { RouteComponentProps } from "react-router-dom";
import gql from "graphql-tag";
// import { Query, graphql } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
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

import { Link } from "react-router-dom";
interface SignUpPagePropsInterface extends RouteComponentProps<{ id: string }> {
  // Other props that belong to component it self not Router
}

type Host = {
  // Mistake #3: The type is wrong here, and that should be caught at compile-time
  email: string;
  firstname: string;
  lastname: string;
};

// type Link = {
//   link: string;
//   duration: number;
//   email: string;
// };

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

type DictionaryItem = {
  dateKey: string;
  values: Date[];
};

const excludeQuery = gql`
  query($url: String) {
    list_available_slots(url: $url) {
      start
      end
    }
  }
`;

const GET_UNIQUE_LINK = gql`
  query($url: String) {
    link_url(url: $url) {
      url
      duration
      used
    }
  }
`;

const SignUpPage: React.FC<SignUpPagePropsInterface> = (
  props: SignUpPagePropsInterface
) => {
  const id = props.match.params.id;
  urlId.urlid = id;

  type slotType = {
    start: string;
    end: string;
  };

  const [startDate, setStartDate] = useState<Date>(
    setHours(setMinutes(new Date(), 30), 16)
  );

  const [startTime, setStartTime] = useState<Date>(
    setHours(setMinutes(new Date(), 30), 16)
  );

  let handleColor = (time: any) => {
    return time.getHours() > 12 ? "text-success" : "text-error";
  };

  let resultArray: DictionaryItem[] = [];

  function useEvents(link: string) {
    const { loading, error, data } = useQuery(excludeQuery, {
      variables: { url: link },
    });
    console.log("DATAA HERE");

    // console.log(data.list_available_slots);

    const available_slots = data?.list_available_slots;
    console.log(available_slots);

    try {
      console.log("Listing items");
      available_slots.map((item: any) => {
        console.log(item);
        let start = new Date(roundStartTimeQuarterHour(new Date(item.start)));
        let end = new Date(roundEndTimeQuarterHour(new Date(item.end)));
        let myDateKey: string = formatDate(start);

        console.log("start" + start);
        console.log("end" + end);

        let currTimeToBeAdded = start;

        let foundDate = resultArray.find((item) => item.dateKey === myDateKey);
        console.log("curr tiem to be added: " + currTimeToBeAdded);
        if (foundDate) {
          // console.log("if found date");
          console.log("foundDate before");
          console.log(foundDate);
          while (currTimeToBeAdded < end) {
            foundDate.values.push(currTimeToBeAdded);
            currTimeToBeAdded = new Date(
              currTimeToBeAdded.getTime() + 15 * 60000
            );
            console.log("add 15 currtimetobeadded: " + currTimeToBeAdded);
          }
          console.log("foundDate after");
          console.log(foundDate);
        } else {
          //console.log("else found date");
          let tempObject: DictionaryItem = {
            dateKey: myDateKey,
            values: [],
          };
          while (currTimeToBeAdded < end) {
            tempObject.values.push(currTimeToBeAdded);
            currTimeToBeAdded = new Date(
              currTimeToBeAdded.getTime() + 15 * 60000
            );
            console.log("add 15 currtimetobeadded: " + currTimeToBeAdded);
          }
          resultArray.push(tempObject);
        }
      });
      console.log("RESULT ARRAY");
      console.log(resultArray);
      //return Promise.resolve(resultArray);
    } catch (err) {
      console.log("an error in the mapping of result array dictionary");
      console.log(err);
      resultArray = [];
      //return Promise.resolve(resultArray);
    }
    // const events = ;

    return { loading, error, resultArray };
  }

  const [excludeTimeList, setExcludeTimeList] = useState<Date[]>([]);
  //let excludeTimeList: Date[] = [];

  type ShowSlotsProps = {
    linkCode: string;
    data: any;
  };

  function roundStartTimeQuarterHour(time: Date) {
    const timeToReturn = time;

    timeToReturn.setMilliseconds(
      Math.floor(timeToReturn.getMilliseconds() / 1000) * 1000
    );
    timeToReturn.setSeconds(Math.floor(timeToReturn.getSeconds() / 60) * 60);
    timeToReturn.setMinutes(Math.floor(timeToReturn.getMinutes() / 15) * 15);
    return timeToReturn;
  }

  function roundEndTimeQuarterHour(time: Date) {
    const timeToReturn = time;

    timeToReturn.setMilliseconds(
      Math.ceil(timeToReturn.getMilliseconds() / 1000) * 1000
    );
    timeToReturn.setSeconds(Math.ceil(timeToReturn.getSeconds() / 60) * 60);
    timeToReturn.setMinutes(Math.ceil(timeToReturn.getMinutes() / 15) * 15);
    return timeToReturn;
  }

  // const formatDate = (date: Date) =>
  //   `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  function ShowSlots(showSlotInfo: ShowSlotsProps) {
    console.log("loading show slots again");
    const { loading, error, resultArray } = useEvents(showSlotInfo.linkCode);
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
            console.log("DATE CHANGED");
            setStartDate(date);
            const key = formatDate(date);

            console.log("mykey: " + key);
            //TODO: change setExcludeTimeList to get from server query

            let tempDictionaryItem = resultArray.find(
              (item: any) => item.dateKey === key
            );

            if (tempDictionaryItem !== undefined) {
              console.log("setting exclude time list");
              let newDictionaryItemList: Date[] = [];
              tempDictionaryItem.values.map((input) => {
                let newInput = setSeconds(
                  setMinutes(
                    setHours(new Date(), input.getHours()),
                    input.getMinutes()
                  ),
                  0
                );
                newDictionaryItemList.push(newInput);
              });

              setExcludeTimeList(newDictionaryItemList);
              // excludeTimeList = newDictionaryItemList;
            }
            console.log("EXCLUDE TIME LIST");
            console.log(excludeTimeList);
            setSelect(true);
          }}
          timeFormat="HH:mm"
          timeIntervals={showSlotInfo.data.link_url.duration}
          inline
        />
        {selectTime && (
          <DatePicker
            showTimeSelect
            showTimeSelectOnly
            selected={startTime}
            onChange={(date: Date) => {
              setStartTime(date);
              console.log("the list after the click WHYYYYYYYYYY");
              console.log(excludeTimeList);
            }}
            timeFormat="HH:mm"
            timeIntervals={showSlotInfo.data.link_url.duration}
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
      variables: { url: urlId.urlid },
    });

    return loading ? (
      <div>loading</div>
    ) : error ? (
      <div>An Error occurred: {error}</div>
    ) : (
      <body style={{ background: "rgba(131, 196, 197)" }}>
        <div>
          {data.link_url === null && (
            <div>
              <h3> 404 Not Found!</h3>
              <Link to="/">Main Page</Link>
            </div>
          )}
          {data.link_url !== null && (
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
                      margin: 0,
                      justifyContent: "center",
                      top: 20,
                    }}
                  >
                    Signup Page
                  </h1>
                </div>
              </TopFormat>

              {!data.link_url.used && (
                <MainBodyFormat>
                  <h1 style={{ top: 10, margin: 20 }}>
                    Sign up for your {data.link_url.duration} minute meeting.
                  </h1>
                  <h2 style={{ margin: 20 }}>
                    Select the date, then the time.
                  </h2>
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
              )}

              {data.link_url.used && (
                <MainBodyFormat>
                  <h1 style={{ top: 10, margin: 20 }}>
                    Sorry! Link has been used! 😢
                  </h1>
                </MainBodyFormat>
              )}
            </div>
          )}
        </div>

        {/*         
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
                    margin: 0,
                    justifyContent: "center",
                    top: 20,
                  }}
                >
                  Signup Page
                </h1>
              </div>
            </TopFormat>

            {!data.link_url.used && (
              <MainBodyFormat>
                <h1 style={{ top: 10, margin: 20 }}>
                  Sign up for your {data.link_url.duration} minute meeting.
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
            )}

            {data.link_url.used && (
              <MainBodyFormat>
                <h1 style={{ top: 10, margin: 20 }}>
                  Sorry! Link has been used! 😢
                </h1>
              </MainBodyFormat>
            )}
          </div> */}
      </body>
    );
  }

  return <IntervalSetup />;
};

export default SignUpPage;
