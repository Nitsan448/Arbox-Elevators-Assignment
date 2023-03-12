import React from "react";
import classes from "./Elevators.module.css";
import { useSelector } from "react-redux";

function Elevators(props) {
	const settings = useSelector((state) => state.settings);
	console.log(settings);
	return <></>;
}

export default Elevators;
