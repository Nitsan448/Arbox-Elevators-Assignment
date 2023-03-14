import React, { useReducer } from "react";
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
					isWaiting: action.payload.isWaiting,
					hasArrived: action.payload.hasArrived,
					queue: action.payload.queue,
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
			isWaiting: false,
			hasArrived: true,
			queue: [
				{ destination: 2, timeToArrive: 12 },
				{ destination: 4, timeToArrive: 12 },
				{ destination: 3, timeToArrive: 12 },
			],
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
				{getElevatorButton(elevator, rowIndex)}
			</React.Fragment>
		);
	}

	function getFloorText(floor) {
		const floorText = floor === 0 ? "Ground Floor" : `${floor}${getNumberSuffix(floor)}`;
		return floorText;
	}

	function getElevatorButton(elevator, rowIndex) {
		return (
			<ElevatorButton
				onClick={() =>
					dispatchUpdateElevators({
						payload: {
							index: elevator.index,
							floor: elevator.floor,
							isWaiting: elevator.isWaiting,
						},
					})
				}
				text={getElevatorButtonText(rowIndex)}
			/>
		);
	}

	function getElevatorButtonText(rowIndex) {
		for (let i = 0; i < elevators.length; i++) {
			const elevatorInFloor = elevators[i].floor === rowIndex;
			if (elevatorInFloor && elevators[i].isWaiting) {
				return "waiting";
			} else if (elevatorInFloor && elevators[i].hasArrived && elevators[i].queue.length === 0) {
				return "arrived";
			}
		}
		return "call";
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
