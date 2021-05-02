import React, { useEffect, useState } from "react";
import "./Admin.css";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { auth, db } from "./firebase";
import { useHistory } from "react-router";
import { login } from "./app/counterSlice";

function Admin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
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
        if (u.Account.register === "Admin") {
          dispatch(
            login({
              Name: user.displayName,
              email: user.email,
              AvatarPhoto: user.photoURL,
              uid: user.uid,
            })
          );
          history.push(`/admin/${user.uid}`);
        } else {
          alert("No admin account with same credentials");
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <div className="admin">
      <h1 className="adminLoginTitle">Administrator Login</h1>
      <form className="adminLoginForm" onSubmit={handleSubmit(onSubmit)}>
        <input
          autoFocus
          className="adminLoginInput"
          type="email"
          placeholder="email"
          name="Email"
          {...register("Email", { required: true })}
        />
        {errors.Email && <span className="adminErrorMsg">E-Mail missing</span>}
        <input
          placeholder="Password"
          className="adminLoginInput"
          name="Password"
          type="password"
          {...register("Password", { required: true })}
        />
        {errors.Password && (
          <span className="adminErrorMsg">Password missing</span>
        )}
        <input className="adminLoginButton" type="submit" />
      </form>
    </div>
  );
}

export default Admin;
