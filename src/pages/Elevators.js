import React, { useReducer } from "react";
import classes from "./Elevators.module.css";
import { useSelector } from "react-redux";
import ElevatorButton from "../components/UI/ElevatorButton";
import { getNumberSuffix } from "../helpers/helpers";
import Elevator from "../components/Elevators/Elevator";

function elevatorStateReducer(state, action) {
	switch (action.type) {
		case "UPDATE_ELEVATOR":
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
		case "ADD_ITEM_TO_QUEUE":
			return state.map((elevator) =>
				elevator.index === action.payload.index
					? {
							...elevator,
							queue: [...elevator.queue, action.payload.newItem],
					  }
					: elevator
			);

		default:
			break;
	}
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
			hasArrived: false,
			queue: [],
		}))
	);

	// TODO: change function name
	function getFirstElevatorToArrive(destination) {
		let firstElevatorToArrive = { elevatorIndex: 0, timeUntilArrival: 1000 };

		//TODO: Calculate the time until the elevator arrives, return the one that will arrive first and it's time,
		for (let elevatorIndex = 0; elevatorIndex < elevators.length; elevatorIndex++) {
			const timeUntilArrival = getTimeUntilArrival(elevatorIndex, destination);
			if (timeUntilArrival < firstElevatorToArrive.timeUntilArrival) {
				firstElevatorToArrive = { elevatorIndex, timeUntilArrival };
			}
		}

		return firstElevatorToArrive;
	}

	function getTimeUntilArrival(elevatorIndex, destination) {
		const elevator = elevators[elevatorIndex];
		const timeToSwitchFloor = 1;
		const waitingTime = 2;

		if (elevator.queue.length === 0) {
			let distanceToNextItem = Math.abs(elevator.floor - destination);
			let timeUntilArrival = distanceToNextItem * timeToSwitchFloor + waitingTime;
			return timeUntilArrival;
		}

		let distanceToNextItem = Math.abs(elevator.floor - elevator.queue[0].destination);
		let timeUntilArrival = distanceToNextItem * timeToSwitchFloor + waitingTime;

		for (let index = 1; index < elevator.queue.length; index++) {
			distanceToNextItem = Math.abs(elevator.queue[index - 1].destination - elevator.queue[index].destination);

			const timeUntilArrivalToItem = distanceToNextItem * timeToSwitchFloor;
			timeUntilArrival += timeUntilArrivalToItem + waitingTime;
		}

		distanceToNextItem = Math.abs(elevator.queue[elevator.queue.length - 1].destination - destination);
		timeUntilArrival += distanceToNextItem * timeToSwitchFloor + waitingTime;

		return timeUntilArrival;
	}

	function getGridRow(rowIndex) {
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
				{getElevatorButton(rowIndex)}
			</React.Fragment>
		);
	}

	function getFloorText(floor) {
		const floorText = floor === 0 ? "Ground Floor" : `${floor}${getNumberSuffix(floor)}`;
		return floorText;
	}

	function getElevatorButton(rowIndex) {
		const elevatorToCall = getFirstElevatorToArrive(rowIndex);
		return (
			<ElevatorButton
				onClick={() =>
					dispatchUpdateElevators({
						type: "ADD_ITEM_TO_QUEUE",
						payload: {
							index: elevatorToCall.elevatorIndex,
							newItem: { destination: rowIndex, timeUntilArrival: elevatorToCall.timeUntilArrival },
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
