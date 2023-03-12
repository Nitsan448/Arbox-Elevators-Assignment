import React, { useEffect } from "react";
import classes from "./Elevator.module.css";
import elevatorImage from "../../images/icons8-elevator.svg";

function Elevator(props) {
	return <img className={classes.elevator} src={elevatorImage} alt="elevator" />;
}

export default Elevator;
