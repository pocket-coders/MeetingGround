/*users.jsx*/
import { useForm } from "react-hook-form";
import { RouteComponentProps } from "react-router-dom";
//You have to use the link component to link between you pages
import styled from "@emotion/styled";
import logo from "./img/meetingGroundLogo.png";
import React, { useState } from "react";
// yarn add react-hook-form
//You have to use the link component to link between you pages
import { useMutation } from "react-apollo";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

interface SubmitPagePropsInterface
  extends RouteComponentProps<{ id: string; time: string }> {
  // Other props that belong to component it self not Router
}
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
  background: white;
  display: flex;
  flex-direction: column;
  height: 650px;
  border-radius: 25px;
`;

const Inputformat = styled.input`
  width: 100%;
  padding: 10px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const MainErrorBodyFormat = styled.div`
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  background: white;
  display: flex;
  flex-direction: column;
  height: 650px;
  border-radius: 25px;
`;

const meetingInfo: {
  hostEmail: string;
  duration: number;
} = {
  hostEmail: "",
  duration: 0,
};

const urlId: {
  urlid: string;
} = {
  urlid: "",
};
const createEvent = gql`
  mutation(
    $url: String!
    $email: String!
    $username: String!
    $comment: String!
    $startTime: String!
  ) {
    create_event(
      url: $url
      email: $email
      username: $username
      comment: $comment
      startTime: $startTime
    ) {
      state
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

const SubmitInfoPage: React.FC<SubmitPagePropsInterface> = (
  props: SubmitPagePropsInterface
) => {
  const id = props.match.params.id; //link id
  const scheduledDate = new Date(props.match.params.time.replace("%20", ""));
  urlId.urlid = id;

  const [mutate] = useMutation(createEvent);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      comments: "",
    },
  });

  const clientEmail: {
    email: string;
  } = {
    email: "",
  };

  async function inviteTo(data: any) {
    let myComment = data.comment !== undefined ? data.comment : " ";
    const arg = await mutate({
      variables: {
        url: urlId.urlid,
        email: data.email,
        username: data.firstName + " " + data.lastName,
        comment: myComment,
        startTime: scheduledDate.toString(),
      },
    });
  }

  const onSubmit = (data: any) => {
    console.log(data);
    console.log(data.firstName);
    console.log(data.email);
    clientEmail.email = data.email;
    if (
      !/^[a-zA-Z0-9]+[a-zA-Z0-9_.]*@[a-zA-Z0-9]+.[A-Za-z]+$/.test(data.email)
    ) {
      window.alert("invalid email");
    } else {
      inviteTo(data);
      props.history.push("/confirmation");
    }
  };

  const { loading, error, data } = useQuery(GET_UNIQUE_LINK, {
    variables: { url: urlId.urlid },
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
                margin: 0,
                justifyContent: "center",
                top: 20,
              }}
            >
              Submit Info Page
            </h1>
          </div>
        </TopFormat>
        {!data.link_url.used && (
          <MainBodyFormat>
            <h3 style={{ margin: 20 }}>
              {" "}
              Your scheduled date is {scheduledDate.toString()}
            </h3>
            <h4 style={{ margin: 20 }}>
              {" "}
              Please input your information below to confirm your meeting.
            </h4>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <label htmlFor="firstName">
                  First Name
                  <Inputformat name="firstName" id="firstName" ref={register} />
                </label>

                <label htmlFor="lastName">
                  Last Name
                  <Inputformat name="lastName" id="lastName" ref={register} />
                </label>
              </div>

              <div>
                <label htmlFor="email">Email Address</label>
                <Inputformat name="email" id="email" ref={register} />
              </div>

              <div>
                <label htmlFor="comments">Comments/Questions?</label>
                <Inputformat name="comments" id="comments" ref={register} />
              </div>

              <div
                className="form-group"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <button type="submit" className="btn btn-primary">
                  Submit Info
                </button>
              </div>
            </form>
          </MainBodyFormat>
        )}

        {data.link_url.used && (
          <MainErrorBodyFormat>
            <h1 style={{ top: 10, margin: 20 }}>
              Sorry! Link has been used! 😢
            </h1>
          </MainErrorBodyFormat>
        )}
        {/* <pre id="content"></pre> */}
      </div>
    </body>
  );
};

export default SubmitInfoPage;
