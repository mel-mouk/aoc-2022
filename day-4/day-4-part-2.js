// https://adventofcode.com/2022/day/4

const getInput = () => {
	return new Promise((resolve, reject) => {
		const stdin = process.openStdin();
		let data = "";

		stdin.on('data', function(chunk) {
			data += chunk;
		});

		stdin.on('end', function() {
			resolve(data);
		});
	});
};

(async () => {
	const input = await getInput();

	const result = solve(input);

	console.log(result);
})();

const parseInput = (input) => {
	return input.split("\n")
		.filter(line => line.length)
		.map(line => line.split(/[,-]/).map(val => +val));
}

const pairOverlap = (pair) => {
	// If the start or the second range is in the first range
	if (pair[0] <= pair[2] && pair[2] <= pair[1]) {
		return true;
	}
	// If the end of the second range is in the first range
	if (pair[0] <= pair[3] && pair[3] <= pair[1]) {
		return true;
	}
	// If the start or the first range is in the second range
	if (pair[2] <= pair[0] && pair[0] <= pair[3]) {
		return true;
	}
	// If the end of the first range is in the second range
	if (pair[2] <= pair[1] && pair[1] <= pair[3]) {
		return true;
	}
	return false;
};

const solve = (input) => {
	const pairs = parseInput(input);

	let count = 0;
	pairs.forEach((pair) => {
		if (pairOverlap(pair)) {
			count += 1;
		}
	});

	return count
};
