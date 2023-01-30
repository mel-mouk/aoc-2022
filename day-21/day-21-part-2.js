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
	return operations[monkeys[currentName].operation](value1, value2);
};

const computationIncludesMe = (monkeys, currentName) => {
	if (currentName === 'humn') return true;
	if (monkeys[currentName].number !== undefined) return false;

	return computationIncludesMe(monkeys, monkeys[currentName].name1) || computationIncludesMe(monkeys, monkeys[currentName].name2);
}

const trimKnownBranches = (monkeys, currentName) => {
	if (currentName === 'humn') {
		return undefined;
	}
	if (monkeys[currentName].number !== undefined) {
		return monkeys[currentName].number;
	}
	// Compute operation
	const value1 = trimKnownBranches(monkeys, monkeys[currentName].name1);
	const value2 = trimKnownBranches(monkeys, monkeys[currentName].name2);

	if (value1 === undefined || value2 === undefined) {
		return undefined;
	}

	const operations = {
		"+": (a, b) => a + b,
		"-": (a, b) => a - b,
		"/": (a, b) => a / b,
		"*": (a, b) => a * b,
	}

	monkeys[monkeys[currentName].name1] = undefined;
	monkeys[monkeys[currentName].name2] = undefined;

	monkeys[currentName] = { number: operations[monkeys[currentName].operation](value1, value2) };
	return monkeys[currentName].number;
};

const getOperations = (monkeys, currentName) => {
	if (currentName === 'humn') return undefined;
	if (monkeys[currentName].number !== undefined) {
		return monkeys[currentName].number;
	}
	// Compute operation
	const value1 = getOperations(monkeys, monkeys[currentName].name1);
	const value2 = getOperations(monkeys, monkeys[currentName].name2);

	const oppositeOperation = {
		"+": "-",
		"-": "+",
		"/": "*",
		"*": "/",
	};

	// We can't have two computation as there's only one unknown
	const operation = oppositeOperation[monkeys[currentName].operation];
	// Warning : If opposite operation is -, it's not commutative
	// so if unknown is the first number, that's ok
	// if unknown is the second number, then it's trickier. A = B - x <=> x = B - A
	if (value1 === +value1) {
		if (operation === "+") {
			return [{ operation, number: -value1}, { operation: "*", number: -1 }, ...(value2 || [])];
		}
		return [{ operation, number: value1 }, ...(value2 || [])];
	} else {
		return [{ operation, number: value2 }, ...(value1 || [])];
	}
};

const solve = (input) => {
	const monkeys = parseInput(input);

	trimKnownBranches(monkeys, 'root');
	const rootMonkey = monkeys['root'];
	const firstComputationIncludeMe = computationIncludesMe(monkeys, rootMonkey.name1);

	let knownValue = undefined;
	let key = undefined;
	if (firstComputationIncludeMe) {
		knownValue = getMonkeyNumber(monkeys, rootMonkey.name2);
		key = rootMonkey.name1;
	} else {
		knownValue = getMonkeyNumber(monkeys, rootMonkey.name1);
		key = rootMonkey.name2;
	}

	const operationList = getOperations(monkeys, key);

	let unknown = knownValue;
	const operations = {
		"+": (a, b) => a + b,
		"-": (a, b) => a - b,
		"/": (a, b) => a / b,
		"*": (a, b) => a * b,
	}
	operationList.forEach((op) => {
		unknown = operations[op.operation](unknown, op.number);
	});

	return unknown;
};
