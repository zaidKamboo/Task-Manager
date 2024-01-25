import React, { useContext } from "react";
import { UserContext } from "../store/StateProvider";

const Alert = () => {
  const { alert, setAlert } = useContext(UserContext);
  setTimeout(() => {
    setAlert(null);
  }, 2000);
  return (
    <>
      {alert !== null && (
        <div className="alertContainer">
          <h5 className="alertBody">
            <center>{alert}</center>
          </h5>
          <button className="cross" onClick={() => setAlert(null)}>
            X
          </button>
        </div>
      )}
    </>
  );
};

export default Alert;
