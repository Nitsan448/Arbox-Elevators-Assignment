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

	const [elevators, dispatchUpdateElevators] = useReducer(
		elevatorStateReducer,
		Array.from({ length: settings.elevators }).map((_, index) => ({
			index,
			floor: 0,
			hasArrived: false,
			queue: [],
		}))
	);

	function getClosestElevator(destination) {
		let closestElevator = { elevatorIndex: elevators[0], timeUntilArrival: 1000 };

		elevators.forEach((elevator) => {
			const timeUntilArrival = getTimeUntilArrival(elevator, destination);
			if (timeUntilArrival < closestElevator.timeUntilArrival) {
				closestElevator = { elevator, timeUntilArrival };
			}
		});

		return closestElevator;
	}

	function getTimeUntilArrival(elevator, destination) {
		if (elevator.queue.length === 0) {
			const distanceToDestination = Math.abs(elevator.floor - destination);
			const timeUntilArrival = distanceToDestination * settings.timeToSwitchFloor;
			return timeUntilArrival;
		}

		let distanceToNextItem = Math.abs(elevator.floor - elevator.queue[0].destination);
		let timeUntilArrival = distanceToNextItem * settings.timeToSwitchFloor;

		for (let index = 1; index < elevator.queue.length; index++) {
			distanceToNextItem = Math.abs(elevator.queue[index - 1].destination - elevator.queue[index].destination);

			const timeUntilArrivalToNextItem = distanceToNextItem * settings.timeToSwitchFloor;
			timeUntilArrival += timeUntilArrivalToNextItem + settings.waitingTime;
		}

		distanceToNextItem = Math.abs(elevator.queue[elevator.queue.length - 1].destination - destination);
		timeUntilArrival += distanceToNextItem * settings.timeToSwitchFloor + settings.waitingTime;

		return timeUntilArrival;
	}

	function getGridRow(floor) {
		return (
			<React.Fragment key={floor}>
				<p className={classes.rowNumber}>{getFloorText(floor)}</p>
				{elevators.map((elevator, columnIndex) => (
					<div key={columnIndex} className={classes.cell}>
						{0 === floor && (
							<Elevator updateElevatorState={dispatchUpdateElevators} elevatorState={elevator} />
						)}
						{elevator.floor !== floor && isDestinationInQueue(elevator, floor) && (
							<p>{getTimeUntilArrivalFromQueue(elevator, floor)} sec.</p>
						)}
					</div>
				))}
				{getElevatorButton(floor)}
			</React.Fragment>
		);
	}

	function isDestinationInQueue(elevator, destination) {
		return elevator.queue.some((item) => item.destination === destination);
	}

	function getTimeUntilArrivalFromQueue(elevator, destination) {
		return elevator.queue.find((item) => item.destination === destination).timeUntilArrival;
	}

	function getFloorText(floor) {
		const floorText = floor === 0 ? "Ground Floor" : `${floor}${getNumberSuffix(floor)}`;
		return floorText;
	}

	function getElevatorButton(floor) {
		const closestElevator = getClosestElevator(floor);
		const buttonState = getElevatorButtonState(floor);
		return (
			<ElevatorButton
				onClick={() =>
					dispatchUpdateElevators({
						type: "ADD_ITEM_TO_QUEUE",
						payload: {
							index: closestElevator.elevator.index,
							newItem: { destination: floor, timeUntilArrival: closestElevator.timeUntilArrival },
						},
					})
				}
				disabled={buttonState.disabled}
				text={buttonState.text}
			/>
		);
	}

	function getElevatorButtonState(floor) {
		const elevatorButtonState = { text: "call", disabled: false };
		for (let i = 0; i < elevators.length; i++) {
			const elevatorInFloor = elevators[i].floor === floor;

			if (elevatorInFloor && elevators[i].hasArrived) {
				return { text: "arrived", disabled: true };
			} else if (isDestinationInQueue(elevators[i], floor)) {
				return { text: "waiting", disabled: true };
			}
		}
		return elevatorButtonState;
	}

	return (
		<>
			<h1 className={classes.elevatorExercise}>Elevator Exercise</h1>
			<div
				className={classes.grid}
				style={{
					gridTemplateColumns: `repeat(${+settings.elevators + 2}, 1fr)`,
					gridTemplateRows: `repeat(${+settings.floors}, 1fr)`,
				}}>
				{Array.from({ length: settings.floors }).map((_, floor) => getGridRow(settings.floors - floor - 1))}
			</div>
		</>
	);
}

export default Elevators;
