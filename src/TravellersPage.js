import React, { useEffect, useState } from "react";
import "./TravellersPage.css";
import { useForm } from "react-hook-form";
import { auth, db } from "./firebase";
import { useDispatch } from "react-redux";
import { login } from "./app/counterSlice";
import { useHistory } from "react-router";

function TravellersPage() {
  const history = useHistory();
  var [accData, setAccData] = useState([]);
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

  function searchByMail(mail, Array) {
    for (var i = 0; i < Array.length; i++) {
      if (Array[i].Account.Email === mail) {
        return Array[i];
      }
    }
  }
  function searchById(userId, Array) {
    for (var i = 0; i < Array.length; i++) {
      if (Array[i].Account.id === userId) {
        return Array[i];
      }
    }
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const onSubmit = (data) => {
    auth
      .signInWithEmailAndPassword(data.Email, data.Password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        var u = searchById(user.uid, accData);
        if (u.Account.register === "Consumer") {
          dispatch(
            login({
              Name: user.displayName,
              email: user.email,
              AvatarPhoto: user.photoURL,
              uid: user.uid,
            })
          );
          history.push(`/consumer/${user.uid}`);
        } else {
          alert("Account either not registered or not a consumer");
        }
      })
      .catch((error) => {
        alert(error);
      });
  };
  const forgetPassword = () => {
    var x = prompt("Enter your E-mail.");
    var findBYID = searchByMail(x, accData);
    if (findBYID) {
      if (findBYID.Account.register === "Consumer") {
        auth
          .sendPasswordResetEmail(x)
          .then(function () {
            alert("An E-Mail has been sent to your mail");
          })
          .catch(function (error) {
            alert(error);
          });
        x = "";
      } else {
        alert("User isn't registered as a consumer");
      }
    }
  };
  return (
    <div className="travellerPage">
      <h1 className="travellerLoginTitle">Consumer Account Login</h1>
      <form className="travellerLoginForm" onSubmit={handleSubmit(onSubmit)}>
        <center>
          <input
            autoFocus
            className="travellerLoginInput"
            type="email"
            placeholder="email"
            name="Email"
            {...register("Email", { required: true })}
          />
        </center>
        {errors.Email && (
          <span className="travellerErrorMsg">E-Mail missing</span>
        )}
        <center>
          <input
            placeholder="Password"
            className=" travellerLoginInput"
            name="Password"
            type="password"
            {...register("Password", { required: true })}
          />
        </center>
        {errors.Password && (
          <span className="travellerErrorMsg">Password missing</span>
        )}
        <center>
          {" "}
          <input className="travellerLoginButton" type="submit" />
        </center>
        <p onClick={forgetPassword}>Forgot Password?</p>
      </form>
    </div>
  );
}

export default TravellersPage;
