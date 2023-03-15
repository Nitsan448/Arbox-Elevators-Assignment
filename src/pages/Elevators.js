import React, { useReducer } from "react";
import classes from "./Elevators.module.css";
import { useSelector } from "react-redux";
import ElevatorButton from "../components/UI/ElevatorButton";
import { getNumberSuffix } from "../helpers/helpers";
import Elevator from "../components/Elevators/Elevator";

function elevatorStateReducer(state, action) {
	switch (action.type) {
		case "UPDATE_FLOOR":
			return state.map((elevator) =>
				elevator.index === action.payload.index
					? {
							...elevator,
							floor: action.payload.floor,
					  }
					: elevator
			);
		case "UPDATE_HAS_ARRIVED_STATE":
			return state.map((elevator) =>
				elevator.index === action.payload.index
					? {
							...elevator,
							hasArrived: action.payload.hasArrived,
					  }
					: elevator
			);
		case "UPDATE_QUEUE":
			return state.map((elevator) =>
				elevator.index === action.payload.index
					? {
							...elevator,
							queue: action.payload.queue,
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
		let closestElevator = { elevatorIndex: elevators[0], totalTimeUntilArrival: Number.MAX_VALUE };

		elevators.forEach((elevator) => {
			const totalTimeUntilArrival = getTimeUntilArrival(elevator, destination);
			if (totalTimeUntilArrival < closestElevator.totalTimeUntilArrival) {
				closestElevator = { elevator, totalTimeUntilArrival };
			}
		});

		return closestElevator;
	}

	function getTimeUntilArrival(elevator, destination) {
		if (elevator.queue.length === 0) {
			const distanceToDestination = getDistance(elevator.floor, destination);
			const totalTimeUntilArrival = distanceToDestination * settings.floorTransitionTime;
			return totalTimeUntilArrival;
		}

		let distanceToNextItem = getDistance(elevator.floor, elevator.queue[0].destination);
		let totalTimeUntilArrival = distanceToNextItem * settings.floorTransitionTime;

		for (let index = 1; index < elevator.queue.length; index++) {
			distanceToNextItem = getDistance(elevator.queue[index - 1].destination, elevator.queue[index].destination);

			const timeUntilArrivalToNextItem = distanceToNextItem * settings.floorTransitionTime;
			totalTimeUntilArrival += timeUntilArrivalToNextItem + settings.waitingTime;
		}

		distanceToNextItem = getDistance(elevator.queue[elevator.queue.length - 1].destination, destination);
		totalTimeUntilArrival += distanceToNextItem * settings.floorTransitionTime + settings.waitingTime;

		return totalTimeUntilArrival;
	}

	function getDistance(floor, destination) {
		return Math.abs(floor - destination);
	}

	function getGridRow(floor) {
		return (
			<React.Fragment key={floor}>
				<p className={classes.rowNumber}>{getFloorText(floor)}</p>
				{elevators.map((elevator, columnIndex) => (
					<div key={columnIndex} className={classes.cell}>
						{floor === 0 && (
							<Elevator updateElevatorState={dispatchUpdateElevators} elevatorState={elevator} />
						)}
						{elevator.floor !== floor && getQueueItem(elevator, floor) && (
							<p className={classes.timeUntilArrival}>
								{getTimeUntilArrivalText(getQueueItem(elevator, floor).totalTimeUntilArrival)}
							</p>
						)}
					</div>
				))}
				{getElevatorButton(floor)}
			</React.Fragment>
		);
	}

	function getFloorText(floor) {
		const floorText = floor === 0 ? "Ground Floor" : `${floor}${getNumberSuffix(floor)}`;
		return floorText;
	}

	function getQueueItem(elevator, destination) {
		return elevator.queue.find((item) => item.destination === destination);
	}

	function getTimeUntilArrivalText(timeInSeconds) {
		const minutes = Math.floor(timeInSeconds / 60);
		const seconds = Math.round((timeInSeconds % 60) * 10) / 10;

		let minutesString = minutes === 0 ? "" : `${minutes} min. `;
		let secondsString = seconds.toString() + " sec.";

		if (minutes === 0) {
			minutesString = "";
		}

		return `${minutesString}${secondsString}`;
	}

	function getElevatorButton(floor) {
		const closestElevator = getClosestElevator(floor);
		const buttonState = getElevatorButtonState(floor);

		const newQueue = [
			...closestElevator.elevator.queue,
			{ destination: floor, totalTimeUntilArrival: closestElevator.totalTimeUntilArrival },
		];
		return (
			<ElevatorButton
				onClick={() =>
					dispatchUpdateElevators({
						type: "UPDATE_QUEUE",
						payload: {
							index: closestElevator.elevator.index,
							queue: newQueue,
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
			} else if (getQueueItem(elevators[i], floor)) {
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
