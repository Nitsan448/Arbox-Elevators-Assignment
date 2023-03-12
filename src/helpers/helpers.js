function getNumberSuffix(number) {
	let suffix = "";
	if (number === 1) {
		suffix = "st";
	} else if (number === 2) {
		suffix = "nd";
	} else if (number === 3) {
		suffix = "rd";
	} else if (number >= 4) {
		suffix = "th";
	}

	return suffix;
}

export { getNumberSuffix };
