import Style from "../css/button.module.css";
import React, { useState } from "react";
import Getlocation from "../js/Getlocation";

function Locbutton() {
  const [location, setLocation] = useState(false);

  function handleClick() {
    setLocation(true); // Update state to show the Getlocation component
  }

  return (
    <><div className={`${Style.conatiner}`}>
      <h1>Nearest Metro to your Location</h1>
      {/* Button to trigger action */}
      <button
        onClick={handleClick}
        type="button"
        className={`${Style.buttons} btn btn-light`}
      >
        Fetch Location
      </button>
      
      {/* Conditionally render Getlocation component */}
      {location && <Getlocation />}
      </div>
    </>

  );
}

export default Locbutton;
