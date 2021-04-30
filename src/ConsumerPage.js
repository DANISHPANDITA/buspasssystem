import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import QRCode from "qrcode.react";
import { useHistory } from "react-router";
import "./ConsumerPage.css";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import {
  removePrevRoute,
  createRoute,
  fareReset,
  fareTaker,
  logout,
  resetCount,
  selectUser,
  SeatsReset,
  SelectBusSeatsArray,
  SelectFare,
  SelectPassengers,
  SelectRoute,
} from "./app/counterSlice";
import { Avatar } from "@material-ui/core";
import { db } from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import Select from "react-dropdown-select";
function ConsumerPage() {
  const [tableData, setTableData] = useState({});
  const BusPassSeats = useSelector(SelectBusSeatsArray);
  const TotalAmount = useSelector(SelectFare);
  const totalBookings = useSelector(SelectPassengers);
  const routeSelected = useSelector(SelectRoute);
  const [d, setD] = useState("");
  const [Data, setData] = useState([]);
  const [fare, setFare] = useState(0);
  const [qrState, setQrState] = useState(false);
  const history = useHistory();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [BusData, setBusData] = useState([]);
  const [accData, setAccData] = useState([]);
  const [Places, setPlaces] = useState([]);
  var w = [];
  var q = [];

  useEffect(() => {
    fetch(
      "https://firebasestorage.googleapis.com/v0/b/busapp-aabdc.appspot.com/o/india.json?alt=media&token=60c027af-d9a2-48ba-bd30-855e8c0a06ed"
    )
      .then((res) => res.json())
      .then((data) => setData(data));

    db.collection("BusData")
      .doc("111")
      .collection("Buses")
      .onSnapshot((snapshot) =>
        setBusData(snapshot.docs.map((doc) => doc.data()))
      );
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
  {
    BusData.map((m) => w.push(m.id));
  }
  {
    BusPassSeats.map((e) => q.push(Object.values(e)));
  }
  {
    q = q.reduce((a, b) => a.concat(b), []);
  }

  var bb = [];
  //q(Ids of Buses Booked by user) and w(Buses Ids)
  function findBus(ele1, ele2) {
    for (var i = 0; i < ele1.length; i++) {
      for (var j = 0; j < ele2.length; j++) {
        if (Object.keys(ele1[i])[0] === ele2[j].id) {
          bb.push([ele2[j]["Bus Number"], Object.values(ele1[i])[0]]);
        }
      }
    }
  }
  {
    BusData && findBus(q, BusData);
  }
  function search(userId, Array) {
    for (var i = 0; i < Array.length; i++) {
      if (Array[i].Account.id === userId) {
        return Array[i];
      }
    }
  }
  let ac = search(user.uid, accData);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSignOut = () => {
    dispatch(SeatsReset());
    dispatch(removePrevRoute());
    dispatch(resetCount());
    dispatch(fareReset());
    dispatch(logout());
    history.push("/");
  };
  const bookTicket = () => {
    if (window.confirm("Have You downloaded the QRCode?")) {
      if (window.confirm("Do You Want To Continue?")) {
        toast(`Ticket Booked for ${totalBookings} passengers.`);
        dispatch(SeatsReset());
        dispatch(removePrevRoute());
        dispatch(resetCount());
        dispatch(fareReset());
        setQrState(false);
      }
    }
  };

  function distance(lat1, lon1, lat2, lon2, unit) {
    if (lat1 === lat2 && lon1 === lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit === "K") {
        dist = dist * 1.609344;
      }
      if (unit === "N") {
        dist = dist * 0.8684;
      }
      setFare(parseInt(1.4 * dist));
      return dist;
    }
  }

  const onSubmit = (data) => {
    var x = moment().format("HH");
    if (x >= 7 && x <= 21) {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();
      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      today = yyyy + "-" + mm + "-" + dd;
      if (today !== data.DateOfJourney) {
        alert("Date should be entered of present date.");
      } else {
        setTableData(data);
        let sourceStation = Data.filter(
          (city) => city.name.toLowerCase() === data.Source.toLowerCase()
        );
        let desStation = Data.filter(
          (city) => city.name.toLowerCase() === data.Destination.toLowerCase()
        );
        setD(
          distance(
            parseFloat(sourceStation[0].lat),
            parseFloat(sourceStation[0].lng),
            parseFloat(desStation[0].lat),
            parseFloat(desStation[0].lng),
            "K"
          )
        );
      }
    } else {
      alert("Booking only allowed between 9 A.M and 9 P.M");
    }
  };
  const a = [
    tableData.Source,
    tableData.Destination,
    routeSelected.sour_des,
    totalBookings,
    new Date().toString().slice(4, 15),
    TotalAmount.fare * totalBookings,
    bb.join("---"),
  ];
  const sour_des = a[0] + "-" + a[1];
  const generateQR = () => {
    setQrState(true);
  };
  const downloadQR = () => {
    const hashCode = (s) =>
      s.split("").reduce((a, b) => ((a << 5) + a - b.charCodeAt(0)) | 0, 0);
    const canvas = document.getElementById(a.slice(2, 7).toString());
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `QRCode/${hashCode(a.slice(2, 7).toString())}.jpeg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  const bookSeat = () => {
    dispatch(createRoute({ sour_des }));
    dispatch(fareTaker({ fare }));
    history.push(`/bookseat/${user?.uid}`);
  };
  Data.map((ele) =>
    Places.push({
      label: ele.name,
      value: [ele.lat, ele.lng],
    })
  );

  if (user) {
    return (
      <div className="consumerPage">
        <div className="leftSide">
          <center>
            <Avatar className="travellerImage" src={user?.AvatarPhoto} alt="" />
          </center>
          <div className="details">
            <h2 className="travellerName">{user?.Name}</h2>
            <h3 className="travellerDet">{user?.email}</h3>
            <h3 className="travellerDet">{ac?.Account.Phone}</h3>
          </div>
          <center>
            <button className="signOutButton" onClick={handleSignOut}>
              Sign Out
            </button>
          </center>
        </div>
        <div className="rightSide">
          <h1 className="headerTitle">Book A Bus-Ticket</h1>
          {Places.length > 0 && (
            <form className="busForm" onSubmit={handleSubmit(onSubmit)}>
              <label className="busFormTitle" htmlFor="Source">
                Source Location
              </label>
              <select {...register("Source", { required: true })}>
                {Places.map((value) => (
                  <option key={value.value} value={value.label}>
                    {value.label}
                  </option>
                ))}
              </select>

              {errors.Source && (
                <span className="errorMsg" role="alert">
                  Enter Source Location
                </span>
              )}

              <label className="busFormTitle" htmlFor="Destination">
                Destination
              </label>
              <select {...register("Destination", { required: true })}>
                {Places.map((value) => (
                  <option
                    key={parseInt(Math.random() * 1000000000)}
                    value={value.label}
                  >
                    {value.label}
                  </option>
                ))}
              </select>

              <label className="busFormTitle" htmlFor="DateOfJourney">
                Date of Journey
              </label>
              <input
                type="date"
                className="inputField"
                id="DateOfJourney"
                {...register("DateOfJourney", { required: true })}
              />
              <input className="submitButton" type="submit" />
            </form>
          )}
          {d && fare && (
            <center>
              <table id="customers">
                <tbody>
                  <tr>
                    <th>Header</th>
                    <th>Information</th>
                  </tr>
                  <tr>
                    <td>Source</td>
                    <td>{tableData.Source}</td>
                  </tr>
                  <tr>
                    <td>Destination</td>
                    <td>{tableData.Destination}</td>
                  </tr>
                  <tr>
                    <td>Date Of Journey</td>
                    <td>{tableData.DateOfJourney}</td>
                  </tr>
                  <tr>
                    <td>Distance</td>
                    <td>{parseInt(d)} KM</td>
                  </tr>
                  <tr>
                    <td>Total Fare</td>
                    <td>Rs. {parseInt(fare)}</td>
                  </tr>
                </tbody>
              </table>
              <p className="directQRDownload">
                You Can directly download QRCode if tou have no preference.
              </p>
              <button className="QrButton" onClick={bookSeat}>
                Book Seat
              </button>
            </center>
          )}
          {BusPassSeats.length > 0 && (
            <center>
              <table id="customers">
                <tbody>
                  <tr>
                    <th>Header</th>
                    <th>Information</th>
                  </tr>
                  <tr>
                    <td>Route</td>
                    <td>{routeSelected.sour_des}</td>
                  </tr>
                  <tr>
                    <td>Total Bookings</td>
                    <td>{totalBookings}</td>
                  </tr>
                  <tr>
                    <td>Date Of Journey</td>
                    <td>{new Date().toString().slice(4, 15)}</td>
                  </tr>
                  <tr>
                    <td>Total Fare</td>
                    <td>Rs. {TotalAmount.fare * totalBookings}</td>
                  </tr>
                  <tr>
                    <td>Seats Alloted (Bus No. , Seat No.)</td>
                    <td>{bb.join("---")}</td>
                  </tr>
                </tbody>
              </table>
              <button onClick={generateQR} className="QrButton">
                Click Here To Generate QR
              </button>
            </center>
          )}
          {qrState && (
            <center>
              {" "}
              <div className="qrCodeData">
                <QRCode
                  id={a.slice(2, 7).toString()}
                  size={100}
                  value={a.slice(2, 7).toString()}
                  level="H"
                  includeMargin={true}
                />
                <a onClick={downloadQR}> Download QR </a>
                <button onClick={bookTicket} className="bookTicket">
                  Book Ticket
                </button>
              </div>
            </center>
          )}
        </div>
      </div>
    );
  }
}

export default ConsumerPage;
