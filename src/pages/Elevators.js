import React, { useState, useReducer } from "react";
import classes from "./Elevators.module.css";
import { useSelector } from "react-redux";
import ElevatorButton from "../components/UI/ElevatorButton";
import { getNumberSuffix } from "../helpers/helpers";
import Elevator from "../components/Elevators/Elevator";

function Elevators(props) {
	const settings = useSelector((state) => state.settings);
	const gridTemplateRows = `repeat(${+settings.floors}, 1fr)`;
	const gridTemplateColumns = `repeat(${+settings.elevators + 2}, 1fr)`;

	const [elevators, dispatch] = useReducer(
		(state, action) => {
			switch (action.type) {
				case "update":
					return state.map((elevator, index) =>
						elevator.index === action.payload.index
							? {
									...elevator,
									floor: action.payload.floor,
									destination: action.payload.destination,
									waiting: action.payload.waiting,
							  }
							: elevator
					);
				default:
					return state;
			}
		},
		Array.from({ length: settings.elevators }).map((_, index) => ({
			index,
			floor: 0,
			destination: 0,
			waiting: false,
		}))
	);

	function isElevatorOccupied(elevatorIndex) {
		return (
			elevators[elevatorIndex].floor !== elevators[elevatorIndex].destination || elevators[elevatorIndex].waiting
		);
	}

	function getUnoccupied() {
		for (let i = 0; i < elevators.length; i++) {
			if (!isElevatorOccupied(i)) {
				return i;
			}
		}
	}

	function getElevatorButtonText(rowIndex) {
		let text = "call";
		for (let i = 0; i < elevators.length; i++) {
			if (elevators[i].floor === rowIndex && elevators[i].waiting) {
				text = "waiting";
			}
		}
		return text;
	}

	function getGridRow(rowIndex) {
		const elevatorIndex = getUnoccupied();
		return (
			<React.Fragment key={rowIndex}>
				<p className={classes.rowNumber}>{getFloorText(rowIndex)}</p>
				{elevators.map((elevator, columnIndex) => (
					<div key={columnIndex} className={classes.cell}>
						{0 === rowIndex && <Elevator updateElevatorState={dispatch} elevatorState={elevator} />}
					</div>
				))}
				<ElevatorButton
					onClick={() =>
						dispatch({
							type: "update",
							payload: {
								index: elevatorIndex,
								floor: elevators[elevatorIndex].floor,
								destination: rowIndex,
								waiting: elevators[elevatorIndex].waiting,
							},
						})
					}
					text={getElevatorButtonText(rowIndex)}
				/>
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
