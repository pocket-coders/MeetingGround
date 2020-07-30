/*users.jsx*/
import { useForm } from "react-hook-form";
import { RouteComponentProps } from "react-router-dom";
//You have to use the link component to link between you pages

import styled from "@emotion/styled";
import logo from "./img/meetingGroundLogo.png";
import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
// yarn add react-hook-form
//You have to use the link component to link between you pages
import { useMutation } from "react-apollo";
import gql from "graphql-tag";

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
// async function getNewAccessToken(refreshToken: any) {
//   let data = {
//     client_id: config.config.clientId,
//     client_secret: config.config.clientSecret,
//     refresh_token: refreshToken,
//     grant_type: "refresh_token",
//   };
//   let myaccesstoken = await fetch(
//     "https://www.googleapis.com/oauth2/v2/token",
//     {
//       method: "post",
//       headers: {
//         Content_Type: "application/json",
//         // client_id: config.config.clientId,
//         // client_secret: config.config.clientSecret,
//         // refresh_token: refreshToken,
//         // grant_type: "refresh_token",
//       },
//       body: JSON.stringify(data),
//       // body: {
//       //   client_id: config.config.clientId,
//       //   client_secret: config.config.clientSecret,
//       //   refresh_token: refreshToken,
//       //   grant_type: "refresh_token",
//       // }
//     }
//   )
//     .then((response) => {
//       console.log(response.json());
//     })
//     .then((json) => console.log(json));
// }

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
      // Submit(data);
    }
  };

  return (
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
              Submit Info Page
            </h1>
          </div>
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
        {/* {true && (
          // <ApolloProvider client={client}>
          // <GetHostEmail />
          // </ApolloProvider>
        )} */}
        <pre id="content"></pre>
      </div>
    </body>
  );
};

// const HostInfo: {
//   firstname: string;
//   lastname: string;
//   code: string;
// } = {
//   code: "",
//   firstname: "",
//   lastname: "",
// };

// function GetHostEmail() {
//   const [tempdata, setdata] = useState<any>();
//   const {
//     loading: loadingEmail,
//     error: errorEmail,
//     data: dataEmail,
//   } = useQuery(GET_HOST_EMAIL, {
//     variables: { id: urlId.urlid },
//   });

//   loadingEmail
//     ? console.log("loading Email")
//     : errorEmail
//     ? console.log("An Error occurred:" + { errorEmail })
//     : (meetingInfo.hostEmail = dataEmail.link.email) &&
//       (meetingInfo.duration = dataEmail.link.duration);

//   console.log(meetingInfo.hostEmail);

//   const { loading: loadingCode, error: errorCode, data: dataCode } = useQuery(
//     GET_GOA_CODE,
//     {
//       variables: { id: meetingInfo.hostEmail },
//     }
//   );

//   loadingCode
//     ? console.log("loading access")
//     : errorCode
//     ? console.log("An Error occurred:" + { errorCode })
//     : (HostInfo.code = dataCode.email.goa_code) &&
//       (HostInfo.firstname = dataCode.email.firstname) &&
//       (HostInfo.lastname = dataCode.email.lastname);

//   console.log(HostInfo.code);

//   return <div>the Email is authentified</div>;
// }

// const GET_HOST_EMAIL = gql`
//   query($id: String) {
//     link(id: $id) {
//       email
//       duration
//     }
//   }
// `;

// const GET_GOA_CODE = gql`
//   query($id: String) {
//     email(id: $id) {
//       goa_code
//       firstname
//       lastname
//     }
//   }
// `;

export default SubmitInfoPage;
