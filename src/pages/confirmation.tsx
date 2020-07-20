/*users.jsx*/
import React from "react";
//You have to use the link component to link between you pages
import { Link } from "react-router-dom";

const ConfirmationPage = () => {
  return (
    <div>
      <h3> Your meeting has been confirmed</h3>
      <Link to="/">Main Page</Link>
    </div>
  );
};

export default ConfirmationPage;
