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
	const rucksacks = input.split("\n");

	let groups = [];
	while (rucksacks.length) {
		groups.push(rucksacks.splice(0, 3));
	}
	return groups;
};

const findBadge = (group) => {
	for (let i = 0; i < group[0].length; i++) {
		const letter = group[0][i];
		if (group[1].indexOf(letter) >= 0 && group[2].indexOf(letter) >= 0) {
			return group[0][i];
		}
	}
	throw new Error("Badge not found");
}

const computePriority = (letter) => {
	const isLowerCase = letter === letter.toLowerCase();
	if (isLowerCase) {
		return letter.charCodeAt(0) - ("a".charCodeAt(0)) + 1;
	}
	return letter.charCodeAt(0) - ("A".charCodeAt(0)) + 27;
};

const solve = (input) => {
	const groups = parseInput(input);
	let result = 0;

	groups.forEach((group) => {
		const badge = findBadge(group);
		result += computePriority(badge);
	});

	return result;
};
