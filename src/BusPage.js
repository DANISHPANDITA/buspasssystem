import { Avatar, IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { logout, selectUser } from "./app/counterSlice";
import "./BusPage.css";
import { auth, db, storage } from "./firebase";
import QrReader from "react-qr-reader";
import { Tooltip } from "@material-ui/core";
import _ from "lodash";
import moment from "moment";
import {
  addToBookArray,
  emptyBookedSeatsBusArray,
  SelectBookedSeatsArray,
} from "./app/driverSlice";
import {
  AddToPhotosRounded,
  Close,
  CreateRounded,
  MoreHorizRounded,
} from "@material-ui/icons";
import firebase from "firebase";
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
  const [SetNewImageState, setSetNewImageState] = useState(false);
  const [openMenuState, setOpenMenuState] = useState(false);
  const [progress, setProgress] = useState("");
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
  function buildPhotoSelector() {
    const fileSelector = document.createElement("input");
    fileSelector.setAttribute("type", "file");
    fileSelector.setAttribute("accept", "image/jpg, image/png");
    return fileSelector;
  }

  const SelectNewPhoto = (e) => {
    e.preventDefault();
    const fileSelector = buildPhotoSelector();
    fileSelector.click();
    fileSelector.addEventListener("change", (event) => {
      const file = event.target.files[0];

      if (file) {
        const uploadTask = storage.ref(`users/${file.name}`).put(file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            var progress = Math.floor(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED:
                break;
              case firebase.storage.TaskState.RUNNING:
                break;
              default:
                console.log("..");
            }
          },
          (error) => {
            console.log(error);
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              auth.currentUser
                .updateProfile({
                  photoURL: downloadURL,
                })
                .then(function () {
                  alert("Successfully Updated Profile Picture,Please Refresh");
                })
                .catch(function (error) {
                  alert(error);
                });
            });
          }
        );
      }
    });
  };

  return (
    <div className="busPage">
      <div className="busPageLeftSide">
        <center>
          <Avatar className="busDriverPhoto" src={user?.AvatarPhoto} alt="" />
        </center>
        <div className="busDetails">
          <h2 className="busDriverName">{u?.Account.name}</h2>
          <h3 className="busDriverDet">{user?.email}</h3>
          <h3 className="busDriverDet">{u?.Account.Phone}</h3>
          <h3 className="busDriverDet">
            Route : {u?.Account.route}{" "}
            <CreateRounded
              className="changeRoute"
              onClick={() => {
                alert("Contact Admin to change route");
              }}
            />{" "}
          </h3>
        </div>
        <center>
          <button className="signOutButton" onClick={handleSignOut}>
            Sign Out
          </button>
        </center>
        <center>
          {BusLocation.length > 0 ? (
            <div className="locationUpdate">
              <h4 className="LocationUpdate">Last Updated at : {UpdateTime}</h4>
            </div>
          ) : (
            <h2 className="LocationUpdate">Location Not Available</h2>
          )}
          {Loc.length === 0 ? (
            <h4 className="LocationUpdate">
              Can't find the location at the moment. Try after some time.
            </h4>
          ) : (
            <h4 className="LocationUpdate">Current Location : {Loc}</h4>
          )}
        </center>
        <center>
          {!openMenuState ? (
            <div className="falseStateMenu">
              <IconButton className="MoreOptionsConsumerPage">
                <MoreHorizRounded
                  className="moreOptionsConsumerPage"
                  onClick={() => setOpenMenuState(true)}
                />
              </IconButton>
              <p>More Options</p>
            </div>
          ) : (
            <div className="trueStateMenu">
              <IconButton className="CloseMoreOptionsConsumerPage">
                <Close
                  className="closeMoreOptionsConsumerPage"
                  onClick={() => setOpenMenuState(false)}
                />{" "}
              </IconButton>
              <p
                onClick={() => {
                  var NewLogInName = prompt("Enter New Name");
                  if (NewLogInName) {
                    if (NewLogInName === auth.currentUser.displayName) {
                      alert("Same Name");
                    } else {
                      auth.currentUser
                        .updateProfile({
                          displayName: NewLogInName,
                        })
                        .then(function () {
                          alert("Name Change Successful , Refresh the Page");
                        })
                        .catch(function (error) {
                          alert(error);
                        });
                    }
                  }
                }}
              >
                Update Your Name
              </p>
              <p
                onClick={() => {
                  setSetNewImageState(true);
                }}
              >
                Update Your Photo
              </p>
              <center>
                {SetNewImageState && (
                  <div className="NewPhotoUpload" onClick={SelectNewPhoto}>
                    <AddToPhotosRounded className="NewPhotoUploadIcon" />
                    <p>Choose Photo</p>
                    {progress && <p>{progress}</p>}
                  </div>
                )}
              </center>
              <p
                onClick={() => {
                  var newPassword = prompt("Enter your new password");
                  if (newPassword) {
                    auth.currentUser
                      .updatePassword(newPassword)
                      .then(function () {
                        alert("Successfully Changed Password, Now Login Again");
                        dispatch(logout());
                        history.push("/");
                      })
                      .catch(function (error) {
                        alert(error);
                      });
                  }
                }}
              >
                Change Password
              </p>
              <p
                onClick={() => {
                  auth()
                    .currentUser.delete()
                    .then(function () {
                      alert("User Deleted. Redirecting to Home Page.");
                      history.push("/");
                    })
                    .catch(function (error) {
                      alert(error);
                    });
                }}
              >
                Delete Account
              </p>
            </div>
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
