import React from "react";
import { useHistory } from "react-router";
import "./Home.css";
import Fade from "react-reveal/Fade";
import Zoom from "react-reveal/Zoom";
import Bounce from "react-reveal/Bounce";
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
      <Bounce top>
        <h1 className="headerTitle">Online Bus Pass Service</h1>
      </Bounce>
      <div className="loginOptions">
        <Fade bottom>
          <h2 className="loginTitle">Login As</h2>
        </Fade>
        <Zoom top>
          <button className="adminButton" onClick={administratorClick}>
            Administrator
          </button>
        </Zoom>
        <Zoom top>
          <button className="driverButton" onClick={driverClick}>
            Bus Driver / Conductor
          </button>
        </Zoom>
        <Zoom top>
          <button className="travellerButton" onClick={travellerClick}>
            Traveller
          </button>
        </Zoom>
        <Fade bottom>
          <h2 className="signUpTitle">Not An Member Yet?</h2>
        </Fade>
        <Zoom top>
          <button className="signUpButton" onClick={signUpClick}>
            Register
          </button>
        </Zoom>
      </div>
    </div>
  );
}

export default Home;
