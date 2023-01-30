// https://adventofcode.com/2022/day/8

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
		.map(line => line.split("").map(t => +t))
		.filter(line => line.length);
};

const computeScore = (map, line, tree, x, y) => {
	let score = 1;
	const dirs = [
		{ x: 1, y: 0},
		{ x: -1, y: 0 },
		{ x: 0, y: 1 },
		{ x: 0, y: -1 },
	];
	dirs.forEach(dir => {
		let numberOfTreeVisible = 0;
		let curX = x + dir.x;
		let curY = y + dir.y;

		while (curX >= 0 && curX < map.length && curY >= 0 && curY < line.length) {
			numberOfTreeVisible += 1;
			if (map[curX][curY] >= tree) {
				break;
			}
			curX += dir.x;
			curY += dir.y;
		}

		score *= numberOfTreeVisible;
	});
	return score;
};

const solve = (input) => {
	const map = parseInput(input);

	let highestScenicScore = 0;
	map.forEach((line, x) => {
		line.forEach((tree, y) => {
			const score = computeScore(map, line, tree, x, y);

			if (score > highestScenicScore) {
				highestScenicScore = score;
			}
		});
	});
	return highestScenicScore;
};
