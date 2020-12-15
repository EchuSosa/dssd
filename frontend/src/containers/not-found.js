import React from "react";
import { Link } from "react-router-dom";
import AuthService from "../service/auth-service";

class NotFoundPage extends React.Component {
  render() {
    const handleLogout = () => {
      AuthService.logout();
    };
    handleLogout();
    return (
      <div>
        <p style={{ textAlign: "center" }}>
          <Link to="/">Go to Home </Link>
        </p>
      </div>
    );
  }
}
export default NotFoundPage;
