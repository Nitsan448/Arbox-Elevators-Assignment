import React, { useState, useReducer } from "react";
import classes from "./Elevators.module.css";
import { useSelector } from "react-redux";
import ElevatorButton from "../components/UI/ElevatorButton";
import { getNumberSuffix } from "../helpers/helpers";
import Elevator from "../components/Elevators/Elevator";

function elevatorStateReducer(state, action) {
	return state.map((elevator) =>
		elevator.index === action.payload.index
			? {
					index: action.payload.index,
					floor: action.payload.floor,
					destination: action.payload.destination,
					isWaiting: action.payload.isWaiting,
			  }
			: elevator
	);
}

function Elevators(props) {
	const settings = useSelector((state) => state.settings);
	const gridTemplateRows = `repeat(${+settings.floors}, 1fr)`;
	const gridTemplateColumns = `repeat(${+settings.elevators + 2}, 1fr)`;

	const [elevators, dispatchUpdateElevators] = useReducer(
		elevatorStateReducer,
		Array.from({ length: settings.elevators }).map((_, index) => ({
			index,
			floor: 0,
			destination: -1,
			isWaiting: false,
		}))
	);

	const unoccupiedElevators = elevators.filter((_, elevatorIndex) => !isElevatorOccupied(elevators[elevatorIndex]));

	function getClosestUnoccupiedElevator(destination) {
		let closestElevator = unoccupiedElevators[0];

		for (let index = 1; index < unoccupiedElevators.length; index++) {
			const currentClosestDistance = Math.abs(closestElevator.floor - destination);
			const currentElevatorDistance = Math.abs(unoccupiedElevators[index].floor - destination);
			if (currentClosestDistance > currentElevatorDistance) {
				closestElevator = unoccupiedElevators[index];
			}
		}
		return closestElevator;
	}

	function isElevatorOccupied(elevator) {
		const elevatorIsMoving = elevator.floor !== elevator.destination && elevator.destination !== -1;
		return elevatorIsMoving || elevator.isWaiting;
	}

	function getFloorText(floor) {
		const floorText = floor === 0 ? "Ground Floor" : `${floor}${getNumberSuffix(floor)}`;
		return floorText;
	}

	function getElevatorButtonText(rowIndex) {
		let text = "call";
		for (let i = 0; i < elevators.length; i++) {
			if (elevators[i].floor === rowIndex && elevators[i].isWaiting) {
				text = "waiting";
			}
		}
		return text;
	}

	function getGridRow(rowIndex) {
		const elevator = getClosestUnoccupiedElevator(rowIndex);
		return (
			<React.Fragment key={rowIndex}>
				<p className={classes.rowNumber}>{getFloorText(rowIndex)}</p>
				{elevators.map((elevator, columnIndex) => (
					<div key={columnIndex} className={classes.cell}>
						{0 === rowIndex && (
							<Elevator updateElevatorState={dispatchUpdateElevators} elevatorState={elevator} />
						)}
					</div>
				))}
				<ElevatorButton
					onClick={() =>
						dispatchUpdateElevators({
							payload: {
								index: elevator.index,
								floor: elevator.floor,
								destination: rowIndex,
								isWaiting: elevator.isWaiting,
							},
						})
					}
					text={getElevatorButtonText(rowIndex)}
				/>
			</React.Fragment>
		);
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
