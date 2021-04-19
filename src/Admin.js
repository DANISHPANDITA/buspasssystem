import React from "react";
import "./Admin.css";
import { useForm } from "react-hook-form";

function Admin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);
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
