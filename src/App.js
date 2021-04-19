import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import DriverPage from "./DriverPage";
import Admin from "./Admin";
import Home from "./Home";
import TravellersPage from "./TravellersPage";
import SignUp from "./SignUp";
import ConsumerPage from "./ConsumerPage";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser } from "./app/counterSlice";
import { auth, db } from "./firebase";
import BusPage from "./BusPage";
import BOOKTICKET from "./BOOKTICKET";

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [accData, setAccData] = useState([]);
  useEffect(() => {
    auth.onAuthStateChanged((userID) => {
      if (userID) {
        dispatch(
          login({
            Name: userID.displayName,
            email: userID.email,
            AvatarPhoto: userID.photoURL,
            uid: userID.uid,
          })
        );
      } else {
        dispatch(logout());
      }
    });
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
  }, [dispatch]);
  function search(userId, Array) {
    for (var i = 0; i < Array.length; i++) {
      if (Array[i].Account.id === userId) {
        return Array[i];
      }
    }
  }

  var u = search(user?.uid, accData);

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          {u?.Account.register === "Consumer" ? (
            <Route
              exact
              path={`/consumer/${user.uid}`}
              component={ConsumerPage}
            />
          ) : u?.Account.register === "BusDriver" ? (
            <Route exact path={`/driver/${user.uid}`} component={BusPage} />
          ) : (
            <Route exact path={`/admin/${user?.uid}`} component={Admin} />
          )}
          <Route exact path={`/bookseat/${user?.uid}`} component={BOOKTICKET} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/admin" component={Admin} />
          <Route exact path="/driver" component={DriverPage} />
          <Route exact path="/traveller" component={TravellersPage} />
          <Route exact path="/" component={Home} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
