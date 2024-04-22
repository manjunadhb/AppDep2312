import React from "react";
import { useSelector } from "react-redux";
import TopNavigation from "./TopNavigation";

function Home() {
  let storeObj = useSelector((store) => {
    console.log(store);
    return store;
  });

  let deleteProfile = async () => {
    let dataToSend = new FormData();
    dataToSend.append("email", storeObj.loginReducer.userDetails.email);

    let reqOptions = {
      method: "DELETE",
      body: dataToSend,
    };

    let JSONData = await fetch(
      "http://localhost:4567/deleteProfile",
      reqOptions
    );

    let JSOData = await JSONData.json();

    alert(JSOData.msg);
    console.log(JSOData);
  };

  return (
    <div>
      <TopNavigation />
      <button
        onClick={() => {
          deleteProfile();
        }}
      >
        Delete Profile
      </button>
      <h1>Home</h1>
      <h1>
        Welcome, {storeObj.loginReducer.userDetails.firstName}
        {storeObj.loginReducer.userDetails.lastName}
      </h1>
      <br></br>
      <img
        src={`http://localhost:4567/${storeObj.loginReducer.userDetails.profilePic}`}
      ></img>
    </div>
  );
}

export default Home;
