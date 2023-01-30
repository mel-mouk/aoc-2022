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

const isTreeVisible = (map, line, tree, x, y) => {
	const dirs = [
		{ x: 1, y: 0},
		{ x: -1, y: 0 },
		{ x: 0, y: 1 },
		{ x: 0, y: -1 },
	];
	let treeVisible = false;
	dirs.forEach(dir => {
		let curX = x + dir.x;
		let curY = y + dir.y;
		let lineVisible = true;
		while (curX >= 0 && curX < map.length && curY >= 0 && curY < line.length) {
			if (map[curX][curY] >= tree) {
				lineVisible = false;
				break;
			}
			curX += dir.x;
			curY += dir.y;
		}
		treeVisible = treeVisible || lineVisible;
	});
	return treeVisible;
};

const solve = (input) => {
	const map = parseInput(input);

	let visibleTree = 0;
	map.forEach((line, x) => {
		line.forEach((tree, y) => {
			if (x === 0 || x === map.length - 1 || y === 0 || y === line.length - 1) {
				visibleTree += 1;
				return;
			}

			if (isTreeVisible(map, line, tree, x, y)) {
				visibleTree += 1;
			}
		});
	});
	return visibleTree;
};
