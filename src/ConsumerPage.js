import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import QRCode from "qrcode.react";
import { useHistory } from "react-router";
import "./ConsumerPage.css";
import { useDispatch, useSelector } from "react-redux";
import { createRoute, fareTaker, logout, selectUser } from "./app/counterSlice";
import { Avatar } from "@material-ui/core";
import { db } from "./firebase";

function ConsumerPage() {
  const [tableData, setTableData] = useState({});
  const [d, setD] = useState("");
  const [Data, setData] = useState([]);
  const [fare, setFare] = useState(0);
  const [qrState, setQrState] = useState(false);
  const history = useHistory();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [accData, setAccData] = useState([]);

  useEffect(() => {
    fetch(
      "https://firebasestorage.googleapis.com/v0/b/busapp-aabdc.appspot.com/o/india.json?alt=media&token=60c027af-d9a2-48ba-bd30-855e8c0a06ed"
    )
      .then((res) => res.json())
      .then((data) => setData(data));

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
  let ac = search(user.uid, accData);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSignOut = () => {
    dispatch(logout());
    history.push("/");
  };
  const bookTicket = () => {
    if (window.confirm("Have You downloaded the QRCode?")) {
      if (window.confirm("Do You Want To Continue?")) {
        console.log("true");
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
  };
  const a = [
    tableData.Source,
    tableData.Destination,
    tableData.DateOfJourney,
    parseInt(d),
    fare,
  ];
  const sour_des = a[0] + "-" + a[1];
  const generateQR = () => {
    setQrState(true);
  };
  const downloadQR = () => {
    const canvas = document.getElementById(a.toString());
    const pngUrl = canvas.toDataURL("image/jpg");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = a.toString();
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  const bookSeat = () => {
    dispatch(createRoute({ sour_des }));
    dispatch(fareTaker({ fare }));
    history.push(`/bookseat/${user?.uid}`);
  };

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
          <form className="busForm" onSubmit={handleSubmit(onSubmit)}>
            <label className="busFormTitle" htmlFor="Source">
              Source Location
            </label>
            <input
              autoFocus
              className="inputField"
              id="Source"
              {...register("Source", { required: true })}
            />
            {errors.Source && (
              <span className="errorMsg" role="alert">
                Enter Source Location
              </span>
            )}
            <label className="busFormTitle" htmlFor="Destination">
              Destination Location
            </label>
            <input
              className="inputField"
              id="Destination"
              {...register("Destination", { required: true })}
            />
            {errors.Destination && (
              <span className="errorMsg" role="alert">
                Enter Destination Location
              </span>
            )}
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
                    <td>{parseInt(d)}KM</td>
                  </tr>
                  <tr>
                    <td>Total Fare</td>
                    <td>Rs.{parseInt(fare)}</td>
                  </tr>
                </tbody>
              </table>
              <p className="directQRDownload">
                You Can directly download QRCode if tou have no preference.
              </p>
              <button className="QrButton" onClick={bookSeat}>
                Book Seat
              </button>
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
                  id={a.toString()}
                  className="qrCode"
                  size={100}
                  value={a.toString()}
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
