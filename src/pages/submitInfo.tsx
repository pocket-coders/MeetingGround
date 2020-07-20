/*users.jsx*/
import React from "react";
import useForm from "react-hook-form";
import { RouteComponentProps } from "react-router-dom";
//You have to use the link component to link between you pages
import { Link } from "react-router-dom";

interface SubmitPagePropsInterface extends RouteComponentProps<{ id: string }> {
  // Other props that belong to component it self not Router
}

const SubmitInfoPage: React.FC<SubmitPagePropsInterface> = (
  props: SubmitPagePropsInterface
) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });
  const onSubmit = (data: any) => {
    console.log(data);
    props.history.push("/confirmation");
  };
  return (
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
  );
};

export default SubmitInfoPage;
