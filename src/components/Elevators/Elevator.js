import React, { useEffect } from "react";
import classes from "./Elevator.module.css";
import blackElevatorImage from "../../images/elevator-black.svg";
import redElevatorImage from "../../images/elevator-red.svg";
import greenElevatorImage from "../../images/elevator-green.svg";
import elevatorArrivedSound from "../../assets/elevatorArrived.wav";
import { useSelector } from "react-redux";

function Elevator(props) {
	const settings = useSelector((state) => state.settings);
	const { index, floor, hasArrived, queue } = props.elevatorState;
	const updateElevatorState = props.updateElevatorState;

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
				//TODO: Remember to uncomment!!!
				// new Audio(elevatorArrivedSound).play();
			}
			updateElevatorState({
				type: "UPDATE_FLOOR",
				payload: {
					index: index,
					floor: newFloor,
				},
			});
			updateElevatorState({
				type: "UPDATE_HAS_ARRIVED_STATE",
				payload: {
					index: index,
					hasArrived: arrivedInDestination,
				},
			});
		}, settings.timeToSwitchFloor * 1000);
		return () => {
			clearTimeout(timer);
		};
	}, [arrivedInDestination, newFloor, index, settings.timeToSwitchFloor, updateElevatorState]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (arrivedInDestination) {
				const newQueue = [...queue];
				newQueue.shift();
				updateElevatorState({
					type: "UPDATE_QUEUE",
					payload: {
						index: index,
						queue: newQueue,
					},
				});
			}
			updateElevatorState({
				type: "UPDATE_HAS_ARRIVED_STATE",
				payload: {
					index: index,
					hasArrived: false,
				},
			});
		}, settings.waitingTime * 1000);
		return () => {
			clearTimeout(timer);
		};
	}, [arrivedInDestination, index, queue, settings.waitingTime, updateElevatorState]);

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
