/*users.jsx*/
import React from "react";
//You have to use the link component to link between you pages
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div>
      <h3> 404 Not Found!</h3>
      <Link to="/">Main Page</Link>
    </div>
  );
};

export default NotFoundPage;
