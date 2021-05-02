import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./AdminPage.css";
import { selectUser } from "./app/counterSlice";
import { db } from "./firebase";
import { WindMillLoading } from "react-loadingg";
import { useHistory } from "react-router";

function AdminPage() {
  const user = useSelector(selectUser);
  const [Accounts, setAccounts] = useState([]);
  const [Buses, setBuses] = useState([]);
  var [BusTableData, setBusTableData] = useState([]);
  var [AccTableData, setAccTableData] = useState([]);
  const history = useHistory();
  useEffect(() => {
    db.collection("BusData")
      .doc("111")
      .collection("Account")
      .onSnapshot((snapshot) => {
        setAccounts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            Account: doc.data(),
          }))
        );
      });
  }, []);

  useEffect(() => {
    db.collection("BusData")
      .doc("111")
      .collection("Buses")
      .onSnapshot((snapshot) => {
        setBuses(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            Bus: doc.data(),
          }))
        );
      });
  }, []);

  var NewAccounts = Accounts.filter((acc) => {
    return acc.Account.register !== "Admin";
  });
  {
    NewAccounts.map((acc) =>
      AccTableData.push({
        id: acc.id,
        Aadhaar: acc.Account.Aadhaar,
        Email: acc.Account.Email,
        Gender: acc.Account.Gender,
        Name: acc.Account.Name,
        Age: acc.Account.age,
        Phone: acc.Account.Phone,
        registeredAs: acc.Account.register,
      })
    );
  }
  {
    Buses.map((acc) =>
      BusTableData.push({
        id: acc.id,
        Name: acc.Bus.Name,
        BusNumber: acc.Bus["Bus Number"],
        Phone: acc.Bus.PhoneNo,
        Route: acc.Bus.route,
      })
    );
  }

  const uniqueArray = AccTableData.filter((thing, index) => {
    const _thing = JSON.stringify(thing);
    return (
      index ===
      AccTableData.findIndex((obj) => {
        return JSON.stringify(obj) === _thing;
      })
    );
  });
  const uniqueBusArray = BusTableData.filter((thing, index) => {
    const _thing = JSON.stringify(thing);
    return (
      index ===
      BusTableData.findIndex((obj) => {
        return JSON.stringify(obj) === _thing;
      })
    );
  });

  function filterBusTable() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
  function filterUserTable() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myUserInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myUserTable");
    tr = table.getElementsByClassName("BusRow");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByClassName("BusRowData")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
  return (
    <div className="AdminPage">
      <div className="backgroundProfilePicture"></div>
      <center>
        {" "}
        <img className="adminProfilePic" src={user.AvatarPhoto} alt="" />
      </center>
      <center>
        <div className="adminDetails">
          <p>{user.Name}</p>
          <p>{user.email}</p>
        </div>
        {uniqueArray.length > 0 ? (
          <div className="tableData">
            <center>
              <h3 className="usersRegHead">Registered Buses</h3>{" "}
            </center>
            <input
              type="text"
              id="myInput"
              onChange={filterBusTable}
              placeholder="...Search for names"
            />
            <div
              className="table"
              style={{
                "overflow-x": "auto",
                height: "40vh",
                "overflow-y": "auto",
              }}
            >
              <table id="myTable">
                <tr>
                  <th>Serial No.</th>
                  <th>Name</th>
                  <th>Bus Number</th>
                  <th>Phone Number</th>
                  <th>Route</th>
                </tr>
                {uniqueBusArray.map((accData) => {
                  return (
                    <tr>
                      <td>{uniqueBusArray.indexOf(accData) + 1}</td>
                      <td>{accData.Name}</td>
                      <td>{accData.BusNumber}</td>
                      <td>{accData.Phone}</td>
                      <td>{accData.Route}</td>
                    </tr>
                  );
                })}
              </table>
            </div>
          </div>
        ) : (
          <WindMillLoading />
        )}
        {uniqueBusArray.length > 0 ? (
          <div className="UserTableData">
            <center>
              <h3 className="usersRegHead">Registered Users</h3>{" "}
            </center>
            <input
              type="text"
              id="myUserInput"
              onChange={filterUserTable}
              placeholder="...Search for names"
            />
            <div
              className="UserTable"
              style={{
                "overflow-x": "auto",
                height: "40vh",
                "overflow-y": "auto",
              }}
            >
              <table id="myUserTable">
                <tr>
                  <th>Serial No.</th>
                  <th>Name</th>
                  <th>E-Mail</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Phone</th>
                  <th>Aadhaar Number</th>
                  <th>Registered As</th>
                </tr>
                {uniqueArray.map((accData) => {
                  return (
                    <tr className="BusRow">
                      <td className="BusRowData">
                        {uniqueArray.indexOf(accData) + 1}
                      </td>
                      <td className="BusRowData">{accData.Name}</td>
                      <td className="BusRowData">{accData.Email}</td>
                      <td className="BusRowData">{accData.Gender}</td>
                      <td className="BusRowData">{accData.Age}</td>
                      <td className="BusRowData">{accData.Phone}</td>
                      <td className="BusRowData">{accData.Aadhaar}</td>
                      <td className="BusRowData">{accData.registeredAs}</td>
                    </tr>
                  );
                })}
              </table>
            </div>
          </div>
        ) : (
          <WindMillLoading />
        )}
      </center>
    </div>
  );
}

export default AdminPage;
