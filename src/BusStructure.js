import React, { useEffect, useState } from "react";
import { Tooltip } from "@material-ui/core";
import { useDispatch } from "react-redux";
import {
  SeatSelection,
  selectUser,
  countPeople,
  SelectPassengers,
} from "./app/counterSlice";
import { useSelector } from "react-redux";
import d from "./BusArray";
import "./BusStructure.css";
import { db } from "./firebase";

function BusStructure({ id, data }) {
  console.log(data);
  const dispatch = useDispatch();
  const people = useSelector(SelectPassengers);
  const [seatStatusArray, setSeatStatusArray] = useState([]);
  const [aaa, setaaa] = useState([]);
  const [SelectedSeats, setSelectedSeats] = useState([]);
  const user = useSelector(selectUser);

  useEffect(() => {
    var result = Object.entries(data);
    result = result.map((r) => {
      if (r[1] === "empty" || r[1] === "filled") {
        return r[0];
      }
    });
    result = result.filter(function (element) {
      return element !== undefined;
    });

    setSeatStatusArray(result.sort());
    var FilledSeats = result.map((r) => {
      if (r[1] === "filled") {
        return { [user.uid]: { [id]: r[0] } };
      }
    });
    FilledSeats = FilledSeats.filter(function (element) {
      return element !== undefined;
    });
    setSelectedSeats(FilledSeats.sort());
  }, []);
  var values = Object.values(d);
  while (seatStatusArray.length) aaa.push(seatStatusArray.splice(0, 5));

  return (
    <div className="BusShape">
      <h3>Driver Name: {data.Name}</h3>
      <h3>Phone No: {data.PhoneNo}</h3>
      <table className="busTable">
        <tbody>
          <div className="frontPart">
            <img
              className="DriverSeat"
              alt="DriverSeat"
              src="https://cdn3.iconfinder.com/data/icons/car-parts-18/64/car-seat-safety-child-baby-512.png"
            />
          </div>
          {aaa.map((items, index) => {
            return (
              <tr>
                {items.map((subItems, sIndex) => {
                  if (data[subItems] === "empty") {
                    return (
                      <Tooltip title="Empty">
                        <td
                          className="emptySeats"
                          key={sIndex}
                          onClick={() => {
                            dispatch(countPeople());
                            for (let m = 0; m < values.length; m++) {
                              if (`${index}${sIndex}` === values[m]) {
                                var idKey = Object.keys(d).find(
                                  (key) => d[key] === values[m]
                                );
                                if (
                                  window.confirm("Do You Want To Lock Seat?")
                                ) {
                                  dispatch(
                                    SeatSelection({
                                      UserSeatsArray: {
                                        [user.uid]: { [data.id]: idKey },
                                      },
                                    })
                                  );
                                  function func(fieldKey) {
                                    db.collection("BusData")
                                      .doc("111")
                                      .collection("Buses")
                                      .doc(id)
                                      .update({
                                        [fieldKey]: "filled",
                                      });
                                  }
                                  func(idKey);
                                }
                              }
                            }
                          }}
                        >
                          {subItems}
                        </td>
                      </Tooltip>
                    );
                  } else if (data[subItems] === "filled") {
                    return (
                      <Tooltip title="Occupied">
                        <td className="filledSeats" key={subItems}>
                          {subItems}
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
  );
}

export default BusStructure;
