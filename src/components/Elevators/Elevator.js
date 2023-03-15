import React, { useEffect, useRef } from "react";
import classes from "./Elevator.module.css";
import blackElevatorImage from "../../images/elevator-black.svg";
import redElevatorImage from "../../images/elevator-red.svg";
import greenElevatorImage from "../../images/elevator-green.svg";
import elevatorArrivedSound from "../../assets/elevatorArrived.wav";
import { useSelector } from "react-redux";

function Elevator(props) {
	const settings = useSelector((state) => state.settings);
	const { index, floor, hasArrived, queue } = props.elevatorState;
	const updateElevatorState = useRef(props.updateElevatorState);

	const destination = queue.length > 0 ? queue[0].destination : floor;
	let newFloor = floor;
	if (destination > floor) {
		newFloor++;
	} else if (destination < floor) {
		newFloor--;
	}

	const arrivedInDestination = destination === newFloor && queue.length > 0;

	const translationPercent = newFloor * -200;
	//To account for the grid border gap
	const translationPixels = newFloor * -2;

	useEffect(() => {
		const timer = setTimeout(() => {
			if (arrivedInDestination) {
				new Audio(elevatorArrivedSound).play();
			}
			updateElevatorState.current({
				type: "UPDATE_ELEVATOR",
				payload: {
					index: index,
					floor: newFloor,
					hasArrived: arrivedInDestination,
					queue: queue,
				},
			});
		}, settings.timeToSwitchFloor * 1000);
		return () => {
			clearTimeout(timer);
		};
	}, [arrivedInDestination, index, newFloor, queue, settings.timeToSwitchFloor]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (hasArrived) {
				const newQueue = [...queue];
				if (arrivedInDestination) {
					newQueue.shift();
				}
				updateElevatorState.current({
					type: "UPDATE_ELEVATOR",
					payload: {
						index: index,
						floor: floor,
						hasArrived: false,
						queue: newQueue,
					},
				});
			}
		}, settings.waitingTime * 1000);
		return () => {
			clearTimeout(timer);
		};
	}, [arrivedInDestination, hasArrived, index, floor, queue, settings.waitingTime]);

	function getElevatorImage() {
		if (hasArrived) {
			return greenElevatorImage;
		} else if (destination !== floor) {
			return redElevatorImage;
		} else {
			return blackElevatorImage;
		}
	}

	return (
		<img
			style={{
				transform: `translateY(calc(${translationPercent}% + ${translationPixels}px))`,
				transitionDuration: `${settings.timeToSwitchFloor}s`,
			}}
			className={classes.elevator}
			src={getElevatorImage()}
			alt="elevator"
		/>
	);
}

export default Elevator;
