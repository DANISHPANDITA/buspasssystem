import React, { useState } from "react";
import "./SignUp.css";
import { useForm } from "react-hook-form";
import { AddToPhotosRounded } from "@material-ui/icons";
import { useHistory } from "react-router";
import validator from "aadhaar-validator";
import { auth, db, storage } from "./firebase";
import firebase from "firebase";

function SignUp() {
  const [progress, setprogress] = useState("");
  const [photo, setphoto] = useState(null);
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  function buildPhotoSelector() {
    const fileSelector = document.createElement("input");
    fileSelector.setAttribute("type", "file");
    fileSelector.setAttribute("accept", " image/png", "image/jpeg");
    return fileSelector;
  }
  const Selectphoto = (e) => {
    e.preventDefault();
    const fileSelector = buildPhotoSelector();
    fileSelector.click();
    fileSelector.addEventListener("change", (event) => {
      const file = event.target.files[0];
      setphoto(file);
    });
  };
  const onSubmit = (data) => {
    if (photo) {
      if (validator.isValidNumber(data.Aadhaar)) {
        if (data.Password === data.ConfPassword) {
          const uploadTask = storage.ref(`users/${photo.name}`).put(photo);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              var progress = Math.floor(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setprogress(progress);
              switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED:
                  break;
                case firebase.storage.TaskState.RUNNING:
                  console.log(`Progress:${progress}`);
                  break;
                default:
                  console.log("..");
              }
            },
            (error) => {
              alert(error);
            },
            () => {
              uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                auth
                  .createUserWithEmailAndPassword(data.Email, data.Password)
                  .then((userCredential) => {
                    // Signed in
                    var user = userCredential.user;
                    user.updateProfile({
                      displayName: data.Name,
                      photoURL: downloadURL,
                      uid: user.uid,
                    });
                    db.collection("BusData")
                      .doc("111")
                      .collection("Account")
                      .add({
                        id: user.uid,
                        Name: data.Name,
                        Aadhaar: data.Aadhaar,
                        Gender: data.Gender,
                        register: data.registerAs,
                        Phone: data.Phone,
                        age: data.Age,
                      });
                  })
                  .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorCode);
                    console.log(errorMessage);
                  });

                history.push("/");
              });
            }
          );
        } else {
          alert("Passwords don't match'");
        }
      } else {
        alert("Aadhaar Number Not Valid");
      }
    } else {
      alert("Please select a photo first");
    }
    setphoto(null);
  };
  return (
    <div className="signup">
      <h2 className="signupTitle">Register Yourself</h2>
      <form className="signupForm" onSubmit={handleSubmit(onSubmit)}>
        <label className="inputTitle" htmlFor="Aadhaar">
          Aadhaar Number
        </label>
        <input
          autoFocus
          className="inputField"
          id="Aadhaar"
          {...register("Aadhaar", { required: true })}
        />
        {errors.Aadhaar && (
          <span className="errorMsg" role="alert">
            Enter Aadhaar Number
          </span>
        )}
        <label className="inputTitle" htmlFor="Name">
          Name
        </label>
        <input
          className="inputField"
          id="Name"
          {...register("Name", { required: true })}
        />
        {errors.Name && (
          <span className="errorMsg" role="alert">
            Your Name Missing
          </span>
        )}
        <label htmlFor="Password" className="inputTitle">
          Password
        </label>
        <input
          type="password"
          id="Password"
          className="inputField"
          {...register("Password", { required: true })}
        />
        {errors.Password && (
          <span className="errorMsg" role="alert">
            Password Missing
          </span>
        )}
        <label htmlFor="ConfPassword" className="inputTitle">
          Confirm Password
        </label>
        <input
          id="ConfPassword"
          type="password"
          className="inputField"
          {...register("ConfPassword", { required: true })}
        />
        {errors.ConfPassword && (
          <span className="errorMsg" role="alert">
            Confirm Password Missing
          </span>
        )}
        <label htmlFor="Phone" className="inputTitle">
          Phone Number
        </label>
        <input
          id="Phone"
          className="inputField"
          {...register("Phone", { required: true })}
        />
        {errors.Phone && (
          <span className="errorMsg" role="alert">
            Phone Number Missing
          </span>
        )}
        <label htmlFor="Email" className="inputTitle">
          Email
        </label>
        <input
          id="Email"
          type="email"
          className="inputField"
          {...register("Email", { required: true })}
        />
        {errors.Email && (
          <span className="errorMsg" role="alert">
            Email Missing
          </span>
        )}
        <label htmlFor="Age" className="inputTitle">
          Age
        </label>
        <input
          className="inputField"
          id="Age"
          type="number"
          {...register("Age", { required: true, min: 18, max: 99 })}
        />
        {errors.Age && (
          <span className="errorMsg" role="alert">
            You must have an age between 18 and 99
          </span>
        )}
        <label className="inputTitle">Register As</label>
        <select
          className="genderInput"
          name="registerAs"
          {...register("registerAs", { required: true })}
        >
          <option value="BusDriver">Bus Driver</option>
          <option value="Consumer">Consumer</option>
        </select>
        <label className="inputTitle">Gender</label>
        <select
          className="genderInput"
          name="gender"
          {...register("Gender", { required: true })}
        >
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Others</option>
        </select>
        <div className="fileinput">
          <p className="inputTitle">Choose Photo</p>
          <AddToPhotosRounded
            onClick={Selectphoto}
            className="fileInputIconPhoto"
          />
        </div>
        <input className="submitButton" type="submit" />
      </form>
    </div>
  );
}

export default SignUp;
