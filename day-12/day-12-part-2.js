// https://adventofcode.com/2022/day/12

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
	const starts = [];
	const dest = { x: -1, y: -1 };

	const map = input.split("\n")
		.filter(line => line.length)
		.map((line, x) => {
			return line.split("").map((val, y) => {
				if (val === "a") {
					starts.push({ x, y });
					return 'a'.charCodeAt(0) - 'a'.charCodeAt(0);
				}
				if (val === "E") {
					dest.x = x;
					dest.y = y;
					return 'z'.charCodeAt(0) - 'a'.charCodeAt(0);
				}
				return val.charCodeAt(0) - 'a'.charCodeAt(0)
			});
		});
	return { starts, dest, map };
};

const computeDist = (heightMap, distMap, x, y) => {
	if (heightMap[x][y] === 0) {
		return;
	}
	const dirs = [{ x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0}];
	dirs.forEach(dir => {
		let newX = x + dir.x;
		let newY = y + dir.y;

		if (!heightMap[newX] || heightMap[newX][newY] === undefined) {
			return;
		}

		if (heightMap[newX][newY] < heightMap[x][y] - 1) {
			return;
		}

		if (distMap[newX][newY] <= distMap[x][y] + 1) {
			return;
		}

		distMap[newX][newY] = distMap[x][y] + 1;
		computeDist(heightMap, distMap, newX, newY);
	});
};

const solve = (input) => {
	const { starts, dest, map: heightMap } = parseInput(input);

	const distMap = [];
	heightMap.forEach((line, x) => {
		distMap.push([]);
		line.forEach(() => {
			distMap[x].push(Infinity);
		});
	});

	distMap[dest.x][dest.y] = 0;

	computeDist(heightMap, distMap, dest.x, dest.y);

	let min = Infinity;
	starts.forEach(start => {
		let dist = distMap[start.x][start.y];
		if (dist < min) {
			min = dist;
		}
	});

	return min;
};
