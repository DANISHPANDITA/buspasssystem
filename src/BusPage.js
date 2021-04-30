import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { logout, selectUser } from "./app/counterSlice";
import "./BusPage.css";
import { auth, db } from "./firebase";
import QrReader from "react-qr-reader";
import { Tooltip } from "@material-ui/core";
import _ from "lodash";
import moment from "moment";
import {
  addToBookArray,
  emptyBookedSeatsBusArray,
  SelectBookedSeatsArray,
} from "./app/driverSlice";

function BusPage() {
  const user = useSelector(selectUser);
  const [accData, setAccData] = useState([]);
  const [Cities, setCities] = useState([]);
  const [qrState, setQrState] = useState(null);
  const BookedSeats = useSelector(SelectBookedSeatsArray);
  const [SecondTableState, setSecondTableState] = useState(false);
  const [BookSeatArray, setBookSeatArray] = useState([]);
  const [BusLocation, setBusLocation] = useState([]);
  const [UpdateTime, setUpdateTime] = useState("");
  const [qrData, setQrData] = useState("");
  const dispatch = useDispatch();
  const [Loc, setLoc] = useState("");
  const [dest, setDest] = useState("");
  const history = useHistory();
  var [u, setU] = useState([]);
  useEffect(() => {
    fetch(
      "https://firebasestorage.googleapis.com/v0/b/busapp-aabdc.appspot.com/o/india.json?alt=media&token=60c027af-d9a2-48ba-bd30-855e8c0a06ed"
    )
      .then((res) => res.json())
      .then((data) => setCities(data));
  }, []);

  useEffect(() => {
    setUpdateTime(moment().format("h:mm a"));
    var temp = [];
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        alert("Location Not Found");
      }
    }
    function showPosition(position) {
      temp.push(
        _.floor(position.coords.latitude, 1),
        _.floor(position.coords.longitude, 1)
      );
      setBusLocation(temp);
    }
    getLocation();
    Cities.map((o) => {
      if (
        _.floor(o.lat, 1) === BusLocation[0] &&
        _.floor(o.lng, 1) === BusLocation[1]
      ) {
        setLoc(o.name);
      }
    });
  }, [Cities]);

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
  var u1 = {};
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

  {
    u && (u1 = u.Account);
  }
  var u2 = u1["Bus Number"];
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

  const handleSignOut = () => {
    auth.signOut();
    dispatch(logout());
    history.push("/");
  };
  const handleQR = () => {
    setQrState(true);
  };
  const getQRData = (data) => {
    if (data) {
      if (data.split(",")[2] === new Date().toString().slice(4, 15)) {
        var x = BookedSeats.includes(data);
        if (x) {
          alert("Bookings already done");
          setQrState(null);
        } else {
          setQrData(data);
          setSecondTableState(true);
          setQrState(null);
        }
      } else {
        setQrState(null);
        alert("Invalid QR Code.");
      }
    }
  };
  const qrDataArray = qrData.split("---");
  const TotalFare = qrDataArray[0].split(",")[3];
  const TotalPassengers = qrDataArray[0].split(",")[1];
  // const fareForOne = qrDataArray[3];
  function getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
  }
  const Pos = getPosition(qrDataArray[0], ",", 4);
  var c = [];
  c.push(qrDataArray[0].slice(Pos + 1, qrDataArray[0].length));
  if (qrDataArray.length > 1) {
    for (var i = 1; i < qrDataArray.length; i++) {
      c.push(qrDataArray[i]);
    }
  }
  c = c.filter((ele) => ele.slice(0, ele.length - 3) === u2);
  c.sort();

  const saveQrData = () => {
    if (qrData) {
      dispatch(addToBookArray(qrData));
      setSecondTableState(false);
    }
  };
  useEffect(() => {
    BookedSeats.map((ticket) => {
      const PosOfFirstHypen = getPosition(ticket, "-", 1);
      const posOfFirstComma = getPosition(ticket, ",", 1);
      const PosOfSeats = getPosition(ticket, ",", 4);
      var ticketSeats = ticket.substr(PosOfSeats + 1, ticket.length);
      ticketSeats = ticketSeats.split("---");
      ticketSeats.map((ele) =>
        BookSeatArray.push(ele.substr(ele.length - 2, ele.length))
      );
      setDest(ticket.slice(PosOfFirstHypen + 1, posOfFirstComma));
      if (Loc) {
        if (Loc === dest) {
          alert(
            `Reached Location for Passengers on Seats-${BookSeatArray.sort()}`
          );
        }
      }
    });
  }, [Loc]);

  const doneForToday = () => {
    var z = moment().format("H");
    if (z >= 24) {
      alert("Button Disabled upto 9 PM");
    } else {
      var confirmEmptySeats = window.confirm(
        "Are you sure you want to close today?"
      );
      if (confirmEmptySeats) {
        dispatch(emptyBookedSeatsBusArray());
        alert("Bus is now empty.");
        db.collection("BusData")
          .doc("111")
          .collection("Buses")
          .onSnapshot((snapshot) =>
            snapshot.docs.map((doc) => {
              if (doc.id === u.id) {
                const x = doc.data();
                const a = Object.keys(x);
                a.map((ele) => {
                  if (x[ele] === "filled") {
                    x[ele] = "empty";
                  }
                });
                db.collection("BusData")
                  .doc("111")
                  .collection("Buses")
                  .doc(u.id)
                  .set(x);
              }
            })
          );
      }
    }
  };
  return (
    <div className="busPage">
      <div className="busPageLeftSide">
        <center>
          <Avatar className="busDriverPhoto" src={user?.AvatarPhoto} alt="" />
        </center>
        <div className="busDetails">
          <h2 className="busDriverName">{u?.Account.Name}</h2>
          <h3 className="busDriverDet">{user?.email}</h3>
          <h3 className="busDriverDet">{u?.Account.Phone}</h3>
        </div>
        <center>
          <button className="signOutButton" onClick={handleSignOut}>
            Sign Out
          </button>
        </center>
        <center>
          {BusLocation.length > 0 ? (
            <div className="locationUpdate">
              <h4>Last Updated at : {UpdateTime}</h4>
            </div>
          ) : (
            <h2>Location Not Available</h2>
          )}
          {Loc.length === 0 ? (
            <h4>Can't find the location at the moment. Try after some time.</h4>
          ) : (
            <h4>Current Location : {Loc}</h4>
          )}
        </center>
        <center>
          <div className="emptyBus">
            <button onClick={doneForToday}>Done For Today</button>
          </div>
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
          <div className="qrArea">
            <button className="qrButton" onClick={handleQR}>
              QRCode
            </button>
          </div>
        </center>
        {qrState && (
          <center>
            <QrReader
              resolution={720}
              delay={500}
              onError={(err) => {
                alert(err);
              }}
              onScan={getQRData}
              style={{ width: "20%", height: "2.5vh" }}
            />
          </center>
        )}
        {TotalPassengers && SecondTableState && TotalFare && c.length > 0 && (
          <center>
            <table id="customers">
              <tr>
                <td>No. of Passengers</td>
                <td>{TotalPassengers}</td>
              </tr>
              <tr>
                <td>Total Amount</td>
                <td>{TotalFare}</td>
              </tr>
              <tr>
                <td>Seats Booked</td>
                <td>
                  {c.map((ele) => (
                    <p>{ele.split(",")[1]}</p>
                  ))}
                </td>
              </tr>
            </table>
            <button onClick={saveQrData} className="saveData">
              Continue
            </button>
          </center>
        )}
      </div>
    </div>
  );
}

export default BusPage;
