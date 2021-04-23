import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
  SelectFare,
  SelectRoute,
  SelectPassengers,
  selectUser,
  SelectBusSeatsArray,
} from "./app/counterSlice";
import "./BOOKTICKET.css";
import BusStructure from "./BusStructure";
import { db } from "./firebase";

function BOOKTICKET() {
  const history = useHistory();
  const fare = useSelector(SelectFare);
  const user = useSelector(selectUser);
  const BusSeatsFilled = useSelector(SelectBusSeatsArray);
  const route = useSelector(SelectRoute);
  const passengers = useSelector(SelectPassengers);
  const [accData, setAccData] = useState([]);
  const [BusInfo, setBusInfo] = useState([]);
  const [TotalFare, setTotalFare] = useState("");
  const sameRouteBuses = [];

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
    db.collection("BusData")
      .doc("111")
      .collection("Buses")
      .onSnapshot((snapshot) =>
        setBusInfo(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            busData: doc.data(),
          }))
        )
      );
    setTotalFare(fare.fare * passengers);
  }, [fare, passengers]);

  function searchSameRouteBuses(Array, String) {
    for (var i = 0; i < Array.length; i++) {
      if (Array[i].busData.route === String) {
        sameRouteBuses.push(Array[i]);
      }
    }
  }
  searchSameRouteBuses(BusInfo, route.sour_des);
  console.log(sameRouteBuses);
  function search(Array1, Array2) {
    for (var i = 0; i < Array1.length; i++) {
      for (var j = 0; j < Array2.length; j++) {
        if (Array1[i].Account.id === Array2[j].busData.id) {
          return Array1[i];
        }
      }
    }
  }
  const goToCheckOut = () => {
    history.push(`/consumer/${user.uid}`);
  };

  if (sameRouteBuses) {
    return (
      <div className="bookTicketPage">
        <center>
          <h1 className="refreshTitle">Refresh to see seat status. </h1>
          <div className="header">
            <div className="statusByColour">
              <div className="seatShow">
                <div className="greenBox"></div>
                <p className="seatStatusName">Empty Seat</p>
              </div>
              <div className="seatShow">
                <div className="blueBox"></div>
                <p className="seatStatusName">Filled Seat</p>
              </div>
            </div>
            <div className="TotalAmount">
              <p>Rs. {TotalFare}</p>
              <button onClick={goToCheckOut}>Proceed To Checkout</button>
            </div>
          </div>
          {sameRouteBuses.map((bus) => {
            return <BusStructure key={bus.id} id={bus.id} data={bus.busData} />;
          })}
        </center>
      </div>
    );
  } else {
    return <h2>Loading...</h2>;
  }
}
export default BOOKTICKET;
