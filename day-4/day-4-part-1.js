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

const pairFullyOverlap = (pair) => {
	// Section 1 contain section 2
	if (pair[0] <= pair[2] && pair[1] >= pair[3]) {
		return true;
	}
	// Section 2 contain section 1
	if (pair[2] <= pair[0] && pair[3] >= pair[1]) {
		return true;
	}
	return false;
};

const solve = (input) => {
	const pairs = parseInput(input);

	let count = 0;
	pairs.forEach((pair) => {
		if (pairFullyOverlap(pair)) {
			count += 1;
		}
	});

	return count
};
