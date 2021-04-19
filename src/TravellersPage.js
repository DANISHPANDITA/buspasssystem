import React, { useEffect, useState } from "react";
import "./TravellersPage.css";
import { useForm } from "react-hook-form";
import { auth, db } from "./firebase";
import { useDispatch } from "react-redux";
import { login } from "./app/counterSlice";
import { useHistory } from "react-router";
function TravellersPage() {
  const history = useHistory();
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

  function search(userId, Array) {
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
        var u = search(user.uid, accData);
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

  return (
    <div className="travellerPage">
      <h1 className="travellerLoginTitle">Consumer Account Login</h1>
      <form className="travellerLoginForm" onSubmit={handleSubmit(onSubmit)}>
        <input
          autoFocus
          className="travellerLoginInput"
          type="email"
          placeholder="email"
          name="Email"
          {...register("Email", { required: true })}
        />
        {errors.Email && (
          <span className="travellerErrorMsg">E-Mail missing</span>
        )}
        <input
          placeholder="Password"
          className=" travellerLoginInput"
          name="Password"
          type="password"
          {...register("Password", { required: true })}
        />
        {errors.Password && (
          <span className="travellerErrorMsg">Password missing</span>
        )}
        <input className="travellerLoginButton" type="submit" />
      </form>
    </div>
  );
}

export default TravellersPage;
