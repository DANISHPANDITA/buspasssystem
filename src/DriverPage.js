import React, { useEffect, useState } from "react";
import "./DriverPage.css";
import { useForm } from "react-hook-form";
import { auth, db } from "./firebase";
import { useDispatch } from "react-redux";
import { login } from "./app/counterSlice";
import { useHistory } from "react-router";
function DriverPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [accData, setAccData] = useState([]);
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  function search(userId, Array) {
    for (var i = 0; i < Array.length; i++) {
      if (Array[i].Account.id === userId) {
        return Array[i];
      }
    }
  }
  const onSubmit = (data) => {
    auth
      .signInWithEmailAndPassword(data.Email, data.Password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        var u = search(user.uid, accData);
        if (u.Account.register === "BusDriver") {
          dispatch(
            login({
              Name: user.displayName,
              email: user.email,
              AvatarPhoto: user.photoURL,
              uid: user.uid,
            })
          );
          history.push(`/driver/${user.uid}`);
        } else {
          alert(
            "Account either not registered or not a Bus Driver / Conductor"
          );
        }
      })
      .catch((error) => {
        alert(error);
      });
  };
  return (
    <div className="driverPage">
      <h1 className="busLoginTitle">Bus Driver Login</h1>
      <form className="adminLoginForm" onSubmit={handleSubmit(onSubmit)}>
        <input
          autoFocus
          className="busLoginInput"
          type="email"
          placeholder="email"
          name="Email"
          {...register("Email", { required: true })}
        />
        {errors.Email && <span className="busErrorMsg">E-Mail missing</span>}
        <input
          placeholder="Password"
          className=" busLoginInput"
          name="Password"
          type="password"
          {...register("Password", { required: true })}
        />
        {errors.Password && (
          <span className="busErrorMsg">Password missing</span>
        )}
        <input className="busLoginButton" type="submit" />
      </form>
    </div>
  );
}

export default DriverPage;
