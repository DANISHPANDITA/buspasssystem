import React from "react";
import { useHistory } from "react-router";
import "./Home.css";
function Home() {
  const history = useHistory();
  const administratorClick = () => {
    history.push("/admin");
  };
  const driverClick = () => {
    history.push("/driver");
  };
  const travellerClick = () => {
    history.push("/traveller");
  };
  const signUpClick = () => {
    history.push("/signup");
  };
  return (
    <div className="Home">
      <h1 className="headerTitle">Online Bus Pass Service</h1>
      <div className="loginOptions">
        <h2 className="loginTitle">Login As</h2>
        <button className="adminButton" onClick={administratorClick}>
          Administrator
        </button>
        <button className="driverButton" onClick={driverClick}>
          Bus Driver / Conductor
        </button>
        <button className="travellerButton" onClick={travellerClick}>
          Traveller
        </button>
        <h2 className="signUpTitle">Not An Member Yet?</h2>
        <button className="signUpButton" onClick={signUpClick}>
          Register
        </button>
      </div>
    </div>
  );
}

export default Home;
