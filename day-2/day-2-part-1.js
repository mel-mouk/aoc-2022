// https://adventofcode.com/2022/day/2

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

const Choices = {
	Rock: 0,
	Paper: 1,
	Scissors: 2
}

const parseInput = (input) => {
	const firstCol = { 'A': Choices.Rock, 'B': Choices.Paper, 'C': Choices.Scissors };
	const secCol = { 'X': Choices.Rock, 'Y': Choices.Paper, 'Z': Choices.Scissors };
	return input.split("\n")
		.filter(line => line.length)
		.map(line => {
			const parts = line.split(" ");
			return [firstCol[parts[0]], secCol[parts[1]]];
		});
};

const computeRoundScore = (round) => {
	const PointsForChoices = { [Choices.Rock]: 1, [Choices.Paper]: 2, [Choices.Scissors]: 3 };
	const Rules = {
		[Choices.Rock]: Choices.Scissors,
		[Choices.Paper]: Choices.Rock,
		[Choices.Scissors]: Choices.Paper,
	};

	let score = PointsForChoices[round[1]];
	if (round[0] === round[1]) {
		score += 3;
	} else if (Rules[round[1]] === round[0]) {
		score += 6;
	}

	return score;
};

const solve = (input) => {
	const rounds = parseInput(input);

	let score = 0;
	rounds.forEach(round => {
		score += computeRoundScore(round);
	});
	return score;
};
