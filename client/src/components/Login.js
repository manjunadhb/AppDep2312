import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import axios from "axios";

function Login() {
  let emailInputRef = useRef();
  let passwordInputRef = useRef();

  let navigate = useNavigate();
  let dispatch = useDispatch();

  useEffect(() => {
    //validateToken();
  }, []);

  let validateToken = async () => {
    if (localStorage.getItem("token")) {
      let dataToSend = new FormData();
      dataToSend.append("token", localStorage.getItem("token"));

      let reqOptions = {
        method: "POST",
        body: dataToSend,
      };

      let JSONData = await fetch(
        "http://localhost:4567/validateToken",
        reqOptions
      );

      let JSOData = await JSONData.json();
      if (JSOData.status == "success") {
        dispatch({ type: "login", data: JSOData.data });
        navigate("/home");
      } else {
        alert(JSOData.msg);
      }

      console.log(JSOData);
      console.log(JSOData);
    }
  };

  let onLoginBtnClick = async () => {
    let dataToSend = new FormData();
    dataToSend.append("email", emailInputRef.current.value);
    dataToSend.append("password", passwordInputRef.current.value);

    let reqOptions = {
      method: "POST",
      body: dataToSend,
    };

    let JSONData = await fetch(
      "http://localhost:4567/validateLogin",
      reqOptions
    );

    let JSOData = await JSONData.json();

    if (JSOData.status == "success") {
      localStorage.setItem("token", JSOData.data.token);
      dispatch({ type: "login", data: JSOData.data });
      navigate("/home");
    } else {
      alert(JSOData.msg);
    }

    console.log(JSOData);
  };

  let dispatchFunc = () => {
    return async () => {
      let dataToSend = new FormData();
      dataToSend.append("email", emailInputRef.current.value);
      dataToSend.append("password", passwordInputRef.current.value);

      let response = await axios.post("/validateLogin", dataToSend);

      console.log(response);

      if (response.data.status == "success") {
        localStorage.setItem("token", response.data.data.token);
        dispatch({ type: "login", data: response.data.data });
        navigate("/home");
      } else {
        alert(response.data.data.msg);
      }

      // console.log(JSOData);
    };
  };

  return (
    <div className="App">
      <form>
        <h2>Login</h2>
        <div>
          <label>Email</label>
          <input ref={emailInputRef}></input>
        </div>
        <div>
          <label>Password</label>
          <input ref={passwordInputRef}></input>
        </div>
        <button
          type="button"
          onClick={() => {
            dispatch(dispatchFunc());
          }}
        >
          Login
        </button>
      </form>
      <br></br>
      <Link to="/signup">Signup</Link>
    </div>
  );
}

export default Login;
