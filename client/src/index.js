import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { thunk } from "redux-thunk";

let initialStore = {
  userDetails: {},
};

let loginReducer = (latestStore = initialStore, dispatchedObj) => {
  if (dispatchedObj.type == "login") {
    return { ...latestStore, userDetails: dispatchedObj.data };
  }

  return latestStore;
};

let tasksReducer = (latestStore = initialStore, dispatchedObj) => {
  if (dispatchedObj.type == "addTask") {
    return { ...latestStore, userDetails: dispatchedObj.data };
  }

  return latestStore;
};

let leavesReducer = (latestStore = initialStore, dispatchedObj) => {
  if (dispatchedObj.type == "applyLeave") {
    return { ...latestStore, userDetails: dispatchedObj.data };
  }

  return latestStore;
};

let statusReducer = (latestStore = initialStore, dispatchedObj) => {
  if (dispatchedObj.type == "updateStatus") {
    return { ...latestStore, userDetails: dispatchedObj.data };
  }

  return latestStore;
};

let store = createStore(
  combineReducers({ loginReducer, tasksReducer, leavesReducer, statusReducer }),
  applyMiddleware(thunk)
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
