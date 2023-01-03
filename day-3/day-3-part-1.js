// https://adventofcode.com/2022/day/3

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
	return input.split("\n").map(line => {
		const length = line.length;
		const part1 = line.slice(0, length / 2);
		const part2 = line.slice(length / 2);
		return [part1, part2];
	});
};

const findError = ruckstack => {
	for (let i = 0; i < ruckstack[0].length; i++) {
		if (ruckstack[1].indexOf(ruckstack[0][i]) >= 0) {
			return ruckstack[0][i];
		}
	}
	throw new Error("No error found");
};

const computePriority = (letter) => {
	const isLowerCase = letter === letter.toLowerCase();
	if (isLowerCase) {
		return letter.charCodeAt(0) - ("a".charCodeAt(0)) + 1;
	}
	return letter.charCodeAt(0) - ("A".charCodeAt(0)) + 27;
};

const solve = (input) => {
	const rucksacks = parseInput(input);
	let result = 0;

	rucksacks.forEach((rucksack) => {
		const error = findError(rucksack);
		result += computePriority(error);
	});

	return result;
};
