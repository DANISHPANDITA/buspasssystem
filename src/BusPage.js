import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { logout, selectUser } from "./app/counterSlice";
import "./BusPage.css";
import { auth, db } from "./firebase";
import QrReader from "react-qr-reader";
import { EventSeatRounded } from "@material-ui/icons";
function BusPage() {
  const user = useSelector(selectUser);
  const [accData, setAccData] = useState([]);
  const [qrState, setQrState] = useState(null);
  const [qrData, setQrData] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    db.collection("BusData")
      .doc("111")
      .collection("Account")
      .onSnapshot((snapshot) =>
        setAccData(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            Account: doc.data(),
          }))
        )
      );
  }, []);
  function search(userId, Array) {
    for (var i = 0; i < Array.length; i++) {
      if (Array[i].Account.id === userId) {
        return Array[i];
      }
    }
  }

  var u = search(user?.uid, accData);
  const handleSignOut = () => {
    auth.signOut();
    dispatch(logout);
    history.push("/");
  };
  const handleQR = () => {
    setQrState(true);
  };
  const getQRData = (data) => {
    if (data) {
      setQrData(data);
    }
  };
  return (
    <div className="busPage">
      <div className="busPageLeftSide">
        <center>
          <Avatar className="busDriverPhoto" src={user?.AvatarPhoto} alt="" />
        </center>
        <div className="busDetails">
          <h2 className="busDriverName">{user?.Name}</h2>
          <h3 className="busDriverDet">{user?.email}</h3>
          <h3 className="busDriverDet">{u?.Account.Phone}</h3>
        </div>
        <center>
          <button className="signOutButton" onClick={handleSignOut}>
            Sign Out
          </button>
        </center>
      </div>
      <div className="busPageRightSide">
        <center>
          <h4>Refresh to see seat status</h4>
          <div className="BusStructure">
            <div className="LeftColumns">
              <div className="busColumn">
                {[...Array(14)].map((x, i) => (
                  <EventSeatRounded
                    key={i}
                    className="BusSeat"
                    onClick={() => {
                      var x = Math.floor(Math.random() * 5988);
                      console.log(`Clicked on ${x}`);
                    }}
                  />
                ))}
              </div>
              <div className="busColumn">
                {[...Array(14)].map((x, i) => (
                  <EventSeatRounded
                    className="BusSeat"
                    onClick={() => {
                      var x = Math.floor(Math.random() * 5988);
                      console.log(`Clicked on ${x}`);
                    }}
                    key={i}
                  />
                ))}
              </div>
            </div>
            <div className="RightColumns">
              <div className="busColumn">
                {[...Array(14)].map((x, i) => (
                  <EventSeatRounded
                    className="BusSeat"
                    onClick={() => {
                      var x = Math.floor(Math.random() * 5988);
                      console.log(`Clicked on ${x}`);
                    }}
                    key={i}
                  />
                ))}
              </div>
              <div className="busColumn">
                {[...Array(14)].map((x, i) => (
                  <EventSeatRounded
                    className="BusSeat"
                    onClick={() => {
                      var x = Math.floor(Math.random() * 5988);
                      console.log(`Clicked on ${x}`);
                    }}
                    key={i}
                  />
                ))}
              </div>
              <div className="busColumn">
                {[...Array(14)].map((x, i) => (
                  <EventSeatRounded
                    className="BusSeat"
                    onClick={() => {
                      var x = Math.floor(Math.random() * 5988);
                      console.log(`Clicked on ${x}`);
                    }}
                    key={i}
                  />
                ))}
              </div>
            </div>
          </div>
        </center>
        <center>
          {" "}
          <button className="qrButton" onClick={handleQR}>
            QRCode
          </button>
        </center>

        {qrState && (
          <QrReader
            resolution={1920}
            delay={500}
            onError={(err) => {
              console.log(err);
            }}
            onScan={getQRData}
            style={{ width: "100%", height: "20vh" }}
          />
        )}
        <p>{qrData}</p>
      </div>
    </div>
  );
}

export default BusPage;
