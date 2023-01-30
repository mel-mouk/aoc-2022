// https://adventofcode.com/2022/day/21

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
	const monkeys = {};

	input.split("\n")
		.filter(line => line.length)
		.map(line => {
			let parts = line.match(/(.*): (.*) ([-\/*+])? (.*)?/);
			if (parts) { // Operation
				monkeys[parts[1]] = {
					name1: parts[2],
					operation: parts[3],
					name2: parts[4],
				}
			} else {
				parts = line.match(/(.*): (.*)/);
				monkeys[parts[1]] = {
					number: +parts[2],
				};
			}
		});
	return monkeys;
};

const getMonkeyNumber = (monkeys, currentName) => {
	if (monkeys[currentName].number !== undefined) {
		return monkeys[currentName].number;
	}
	// Compute operation
	const value1 = getMonkeyNumber(monkeys, monkeys[currentName].name1);
	const value2 = getMonkeyNumber(monkeys, monkeys[currentName].name2);
	const operations = {
		"+": (a, b) => a + b,
		"-": (a, b) => a - b,
		"/": (a, b) => a / b,
		"*": (a, b) => a * b,
	}
	return operations[monkeys[currentName].operation](value1, value2)
};

const solve = (input) => {
	const monkeys = parseInput(input);

	return getMonkeyNumber(monkeys, 'root');
};
