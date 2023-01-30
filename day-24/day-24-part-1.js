// https://adventofcode.com/2022/day/24

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
	const map = [];
	const blizzards = [];

	input.split('\n').filter(line => line.length)
		.map((line, x) => {
			map[x] = [];
			const cells = line.split('');
			cells.forEach((cell, y) => {
				map[x][y] = cell === '#' ? 1 : 0;
				if (cell !== '.' && cell !== '#') {
					blizzards.push({ direction: cell, x, y });
				}
			});
		});

	return { map, blizzards };
};

let cache = {};

const explore = (maps, position, target, minute = 0, visited) => {
	if (minute > 1000) return -1;
	if (position.x === target.x && position.y === target.y) {
		return minute;
	}

	const map = maps[minute % maps.length];

	const key = `${position.x},${position.y},${minute % maps.length}`;
	const cacheKey = `${position.x},${position.y},${minute}`;
	if (visited.includes(key)) { return -1; }
	visited.push(key);

	if (cache[cacheKey]) {
		return cache[cacheKey];
	}

	const possibleMoves = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
	if (minute !== 0) { possibleMoves.push({ x: 0, y: 0 }); }

	let min = Infinity;
	possibleMoves.forEach((mov) => {
		const newPos = { x: position.x + mov.x, y: position.y + mov.y };
		if (!map[newPos.x] || map[newPos.x][newPos.y] === 1) {
			return;
		}
		let score = explore(maps, newPos, target, minute + 1, [...visited]);
		if (score >= 0) {
			min = Math.min(score, min);
		}
	});
	if (min === Infinity) {
		cache[cacheKey] = -1;
		return -1;
	}
	cache[cacheKey] = min;
	return min;
};

const solve = (input) => {
	const { map, blizzards } = parseInput(input);

	const mapPossibleSetup = [];
	const movCoords = { '>': { x: 0, y: 1 }, 'v': { x: 1, y: 0 }, '<': { x: 0, y: -1 },  '^': { x: -1, y: 0 } };
	for (let turn = 0; turn < (map.length * map[0].length); turn++) {
		let mapConf = JSON.parse(JSON.stringify(map));
		for (let i = 0; i < blizzards.length; i++) {
			const blizzard = blizzards[i];

			blizzard.x = blizzard.x + movCoords[blizzard.direction].x;
			if (blizzard.x === 0) { blizzard.x = map.length -2; }
			if (blizzard.x === map.length - 1) { blizzard.x = 1; }

			blizzard.y = blizzard.y + movCoords[blizzard.direction].y;
			if (blizzard.y === 0) { blizzard.y = map[0].length -2; }
			if (blizzard.y === map[0].length - 1) { blizzard.y = 1; }
			mapConf[blizzard.x][blizzard.y] = 1; // Obstacle
		}
		mapPossibleSetup.push(mapConf);
	}

	const startingPoint = { x: 0, y: map[0].indexOf(0) };
	const targetPoint = { x: map.length - 1, y: map[map.length - 1].indexOf(0) };

	return explore(mapPossibleSetup, startingPoint, targetPoint, 0, []);
};

