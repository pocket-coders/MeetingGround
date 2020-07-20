/*users.jsx*/
import React from "react";
import useForm from "react-hook-form";
import { RouteComponentProps } from "react-router-dom";
//You have to use the link component to link between you pages
import { Link } from "react-router-dom";

interface SubmitPagePropsInterface
  extends RouteComponentProps<{ id: string; time: string }> {
  // Other props that belong to component it self not Router
}

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
    <div>
      <h1> Your scheduled date is {scheduledDate.toString()}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          First Name
          <input name="firstName" ref={register} />
        </label>

        <label>
          Last Name
          <input name="lastName" ref={register} />
        </label>

        <label>
          Email
          <input name="email" ref={register} />
        </label>

        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            Submit Info
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitInfoPage;
