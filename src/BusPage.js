import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { logout, selectUser } from "./app/counterSlice";
import "./BusPage.css";
import { auth, db } from "./firebase";
import QrReader from "react-qr-reader";
import { Tooltip } from "@material-ui/core";

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
      .collection("Buses")
      .onSnapshot((snapshot) =>
        setAccData(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            Account: doc.data(),
          }))
        )
      );
  }, []);
  var u = [];
  var v = [];
  var z = [];
  function search(userId, Array) {
    for (var i = 0; i < Array.length; i++) {
      if (Array[i].Account.id === userId) {
        return Array[i];
      }
    }
  }

  u = search(user?.uid, accData);

  const findSeatsFromArray = (bus) => {
    var resultA = bus.map((r) => {
      if (r[1] === "empty" || r[1] === "filled") {
        return [r[0], r[1]];
      }
    });
    resultA = resultA.filter(function (element) {
      return element !== undefined;
    });
    v = resultA.sort();
  };
  {
    u && findSeatsFromArray(Object.entries(u.Account));
  }
  {
    while (v.length) z.push(v.splice(0, 5));
  }
  {
    z && console.log(z);
  }
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
            <table className="busTable">
              <tbody>
                <div className="frontPart">
                  <img
                    className="DriverSeat"
                    alt="DriverSeat"
                    src="https://cdn3.iconfinder.com/data/icons/car-parts-18/64/car-seat-safety-child-baby-512.png"
                  />
                </div>
                {z.map((items, index) => {
                  return (
                    <tr>
                      {items.map((subItems, sIndex) => {
                        if (subItems[1] === "empty") {
                          return (
                            <Tooltip title="Empty">
                              <td className="emptySeats" key={sIndex}>
                                {subItems[0]}
                              </td>
                            </Tooltip>
                          );
                        } else if (subItems[1] === "filled") {
                          return (
                            <Tooltip title="Occupied">
                              <td className="filledSeats" key={subItems}>
                                {subItems[0]}
                              </td>
                            </Tooltip>
                          );
                        }
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
