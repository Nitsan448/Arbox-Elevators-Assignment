import React, { useEffect, useRef } from "react";
import classes from "./Elevator.module.css";
import elevatorImage from "../../images/icons8-elevator.svg";

function Elevator(props) {
	const { index, floor, isWaiting, queue } = props.elevatorState;
	const updateElevatorState = useRef(props.updateElevatorState);
	const hasMoved = useRef(false);
	const destination = queue.length > 0 ? queue[0].destination : floor;

	if (queue.length > 0) {
		hasMoved.current = true;
	}

	let newFloor = floor;
	if (destination > floor) {
		newFloor++;
	} else if (destination < floor && hasMoved.current) {
		newFloor--;
	}

	const hasArrived = destination === newFloor && hasMoved.current;

	const translationPercent = newFloor * -200;
	//To account for the grid border gap
	const translationPixels = newFloor * -2;

	const timeToSwitchFloor = 1000;
	const waitingTime = 2000;

	useEffect(() => {
		const timer = setTimeout(() => {
			updateElevatorState.current({
				type: "UPDATE_ELEVATOR",
				payload: {
					index: index,
					floor: newFloor,
					isWaiting: hasArrived && queue.length > 0,
					hasArrived: hasArrived,
					queue: queue,
				},
			});
		}, timeToSwitchFloor);
		return () => {
			clearTimeout(timer);
		};
	}, [hasArrived, updateElevatorState, index, newFloor, queue]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (isWaiting) {
				const newQueue = [...queue];
				if (hasArrived && queue.length > 0) {
					newQueue.shift();
				}
				updateElevatorState.current({
					type: "UPDATE_ELEVATOR",
					payload: {
						index: index,
						floor: floor,
						isWaiting: false,
						hasArrived: hasArrived,
						queue: newQueue,
					},
				});
			}
		}, waitingTime);
		return () => {
			clearTimeout(timer);
		};
	}, [hasArrived, waitingTime, updateElevatorState, index, floor, isWaiting, queue]);

	return (
		<img
			style={{
				transform: `translateY(calc(${translationPercent}% + ${translationPixels}px))`,
				transitionDuration: `${timeToSwitchFloor}ms`,
			}}
			className={classes.elevator}
			src={elevatorImage}
			alt="elevator"
		/>
	);
}

export default Elevator;
