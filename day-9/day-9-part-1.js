// https://adventofcode.com/2022/day/9

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

const parseCommands = (input) => {
	return input.split("\n")
		.filter(line => line.length)
		.map(line => {
			const part = line.split(" ");
			return { direction: part[0], amount: +part[1] };
		});
};

const generateMap = (commands) => {
	// Generate very large map compared to the bigest move to avoid negative index or space management
	// Not 100% safe in a real case scenario because we could do R 5 U 1 R 5 which would go too far but enough for this use case
	const maxMove = [...commands].sort((a, b) => b.amount - a.amount)[0].amount;
	const map = [];
	for (let x = 0; x < maxMove * 50 + 1; x++) {
		const line = [];
		for (let y = 0; y < maxMove * 50 + 1; y++) {
			line.push(0);
		}
		map.push(line);
	}
	return map;
};

const solve = (input) => {
	const commands = parseCommands(input);

	const map = generateMap(commands);

	let curHeadX = Math.floor(map.length / 2);
	let curHeadY = Math.floor(map[0].length / 2);
	let curTailX = curHeadX;
	let curTailY = curHeadY;

	map[curTailX][curTailY] = 1;

	commands.forEach(cmd => {
		const dirs = {
			'R': { x: 0, y: 1 },
			'L': { x: 0, y: -1 },
			'U': { x: -1, y: 0 },
			'D': { x: 1, y: 0 },
		};

		for (let i = 0; i < cmd.amount; i++) {
			curHeadX += dirs[cmd.direction].x;
			curHeadY += dirs[cmd.direction].y;

			// Detect if the tails has moved or not
			if (Math.sqrt(Math.pow(curHeadX - curTailX, 2) + Math.pow(curHeadY - curTailY, 2)) < 2) {
				continue;
			}

			// Tails need to move
			if (curHeadX === curTailX) {
				curTailY += curHeadY < curTailY ? -1 : 1;
			} else if (curHeadY === curTailY) {
				curTailX += curHeadX < curTailX ? -1 : 1;
			} else { // Diagonal
				curTailX += curHeadX < curTailX ? -1 : 1;
				curTailY += curHeadY < curTailY ? -1 : 1;
			}

			map[curTailX][curTailY] = 1;
		}
	});

	// Count the occurence of 1 in the map
	const numberOfVisitedCell = map.reduce((acc, line) => {
		let value = line.reduce((acc2, cell) => {
			return +acc2 + cell;
		}, 0);
		return acc + value;
	}, 0);
	return numberOfVisitedCell;
};
