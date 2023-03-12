import React from "react";
import classes from "./Elevators.module.css";
import { useSelector } from "react-redux";
import Button from "../components/UI/Button";

function Elevators(props) {
	const settings = useSelector((state) => state.settings);
	const gridTemplateRows = `repeat(${settings.floors}, 1fr)`;
	const gridTemplateColumns = `repeat(${settings.elevators + 2}, 1fr)`;

	function getGridRow(rowIndex) {
		return (
			<React.Fragment key={rowIndex}>
				<p className={classes.rowNumber}>{getFloorText(rowIndex)}</p>
				{Array.from({ length: settings.elevators }).map((_, columnIndex) => (
					<div key={columnIndex} className={classes.cell}></div>
				))}
				<Button text="call" />
			</React.Fragment>
		);
	}

	function getFloorText(floor) {
		const floorText = floor === 0 ? "Ground Floor" : floor === 1 ? "1st" : floor === 2 ? "2nd" : `${floor}rd`;
		return floorText;
	}

	return (
		<>
			<h1 className={classes.elevatorExercise}>Elevator Exercise</h1>
			<div className={classes.grid} style={{ gridTemplateColumns, gridTemplateRows }}>
				{Array.from({ length: settings.floors }).map((_, rowIndex) => getGridRow(rowIndex))}
			</div>
		</>
	);
}

export default Elevators;
