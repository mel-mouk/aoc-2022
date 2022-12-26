// https://adventofcode.com/2022/day/1

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
	return input.split("\n\n").map(list => {
		return list.split("\n").filter(line => line.length);
	});
};

const solve = (input) => {
	const elvesItems = parseInput(input);

	const elvesCalories = elvesItems.map(list => list.reduce((acc, cur) => acc + +cur, 0));

	const sortedElvesCalories = elvesCalories.sort((a, b) => b - a);

	return sortedElvesCalories.slice(0, 3).reduce((acc, cur) => acc + cur, 0);
};
