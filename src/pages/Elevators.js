import React, { useState } from "react";
import classes from "./Elevators.module.css";
import { useSelector } from "react-redux";
import ElevatorButton from "../components/UI/ElevatorButton";
import { getNumberSuffix } from "../helpers/helpers";
import Elevator from "../components/Elevators/Elevator";

function Elevators(props) {
	const settings = useSelector((state) => state.settings);
	const gridTemplateRows = `repeat(${+settings.floors}, 1fr)`;
	const gridTemplateColumns = `repeat(${+settings.elevators + 2}, 1fr)`;

	const [elevators, setElevators] = useState(
		Array.from({ length: settings.elevators }).map((_, index) => ({ floor: 0, destination: 0 }))
	);

	function updateElevatorFloor(elevatorIndex, newFloor) {
		let newElevators = [...elevators];
		newElevators[elevatorIndex].floor = newFloor;
		setElevators(newElevators);
	}

	function getGridRow(rowIndex) {
		return (
			<React.Fragment key={rowIndex}>
				<p className={classes.rowNumber}>{getFloorText(rowIndex)}</p>
				{elevators.map((elevator, columnIndex) => (
					<div key={columnIndex} className={classes.cell}>
						{0 === rowIndex && (
							<Elevator
								updateElevatorFloor={() => updateElevatorFloor(1, rowIndex)}
								elevatorState={elevators[columnIndex]}
							/>
						)}
					</div>
				))}
				<ElevatorButton onClick={() => updateElevatorFloor(1, rowIndex)} text="call" />
			</React.Fragment>
		);
	}

	function getFloorText(floor) {
		const floorText = floor === 0 ? "Ground Floor" : `${floor}${getNumberSuffix(floor)}`;
		return floorText;
	}

	return (
		<>
			<h1 className={classes.elevatorExercise}>Elevator Exercise</h1>
			<div className={classes.grid} style={{ gridTemplateColumns, gridTemplateRows }}>
				{Array.from({ length: settings.floors }).map((_, rowIndex) =>
					getGridRow(settings.floors - rowIndex - 1)
				)}
			</div>
		</>
	);
}

export default Elevators;
