import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./AdminPage.css";
import { logout, selectUser } from "./app/counterSlice";
import { auth, db, storage } from "./firebase";
import { WindMillLoading } from "react-loadingg";
import { useHistory } from "react-router";
import { IconButton, Tooltip } from "@material-ui/core";
import {
  CreateRounded,
  FaceRounded,
  PersonRounded,
  VpnKeyRounded,
} from "@material-ui/icons";
import firebase from "firebase";
function AdminPage() {
  const user = useSelector(selectUser);
  const [Accounts, setAccounts] = useState([]);
  const [Buses, setBuses] = useState([]);
  var [BusTableData, setBusTableData] = useState([]);
  var [AccTableData, setAccTableData] = useState([]);
  const history = useHistory();
  const [progress, setProgress] = useState("");
  const dispatch = useDispatch();
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
  function buildPhotoSelector() {
    const fileSelector = document.createElement("input");
    fileSelector.setAttribute("type", "file");
    fileSelector.setAttribute("accept", "image/jpg, image/png");
    return fileSelector;
  }
  const changePhoto = (e) => {
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
    <div className="AdminPage">
      <div className="backgroundProfilePicture">
        <div className="extraButtons">
          <Tooltip title="Sign Out" placement="right-start">
            <IconButton
              className="extraButton"
              onClick={() => {
                auth.signOut();
                dispatch(logout());
                alert("Redirecting to Home Page...");
                history.push("/");
              }}
            >
              {" "}
              <PersonRounded className="ExtraButton" />{" "}
            </IconButton>
          </Tooltip>
          <Tooltip title="Change Profile Pic" placement="right-start">
            <IconButton onClick={changePhoto} className="extraButton">
              {" "}
              <FaceRounded className="ExtraButton" />
              {progress && (
                <p>
                  <small> {progress}</small>
                </p>
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="ChangePassword" placement="right-start">
            <IconButton className="extraButton">
              {" "}
              <VpnKeyRounded className="ExtraButton" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <center>
        {" "}
        <img className="adminProfilePic" src={user.AvatarPhoto} alt="" />
      </center>
      <center>
        <div className="adminDetails">
          <p>
            {user.Name}
            <Tooltip title="Rename Admin" placement="right-start">
              <IconButton
                className="EditButton"
                onClick={() => {
                  var x = prompt("Enter New Name");
                  if (x && x.length > 0) {
                    if (x === user.Name) {
                      alert("New name cannot be same as old name.");
                    } else {
                      auth.currentUser.updateProfile({
                        displayName: x,
                      });
                      alert("Name Updated. Refresh to see Change");
                    }
                  } else {
                    alert("Nothing Entered");
                  }
                }}
              >
                <CreateRounded className="editButton" />
              </IconButton>
            </Tooltip>
          </p>
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
