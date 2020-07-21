/*users.jsx*/
import React from "react";
import useForm from "react-hook-form";
import { RouteComponentProps } from "react-router-dom";
//You have to use the link component to link between you pages

import styled from "@emotion/styled";
import logo from "./img/meetingGroundLogo.png";
import { Link } from "react-router-dom";

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

const SubmitInfoPage: React.FC<SubmitPagePropsInterface> = (
  props: SubmitPagePropsInterface
) => {
  const id = props.match.params.id; //link id
  const scheduledDate = new Date(props.match.params.time.replace("%20", ""));

  const { register, handleSubmit } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      comments: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    if (
      !/^[a-zA-Z0-9]+[a-zA-Z0-9_.]*@[a-zA-Z0-9]+.[A-Za-z]+$/.test(data.email)
    ) {
      window.alert("invalid email");
    } else {
      props.history.push("/confirmation");
    }
  };
  //^[a-zA-Z0-9]+[a-zA-Z0-9_.]*@[a-zA-Z0-9]+\.+[A-Za-z]+$/

  //^[a-zA-Z0-9]+[a-zA-Z0-9_.]*@[a-zA-Z0-9]+\.[A-Za-z]+$

  return (
    <body style={{ background: "rgba(131, 196, 197)" }}>
      <div style={{ padding: "1rem" }}>
        <TopFormat>
          <LogoCard id="logo" src={logo} alt="Meeting Ground Logo" />

          <h1
            style={{
              position: "relative",
              width: 300,
              margin: 0,
              float: "left",
              left: "15%",
              top: 20,
            }}
          >
            Info Page
          </h1>

          <button
            className="btn btn-danger"
            id="signout_button"
            //onClick={handleSignoutClick}
            style={{
              height: "30%",
              justifyContent: "center",
              alignContent: "center",
              float: "right",
              margin: 30,
            }}
          >
            Sign Out
          </button>
        </TopFormat>
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
                {/* <input
                  name="firstName"
                  id="firstName"
                  ref={register}
                  style={{
                    width: "100%",
                    padding: "12px 20px",
                    margin: "8px 0",
                    display: "inline-block",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                  }}
                /> */}
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
      </div>
    </body>
  );
};

export default SubmitInfoPage;
