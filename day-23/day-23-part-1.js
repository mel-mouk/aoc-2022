// https://adventofcode.com/2022/day/23

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
		.filter(line => line.length)
		.map(line => line.split(""));
};

const canGoInDirection = (map, coord, direction) => {
	const cellToCheck = {
		'N': [{ x: -1, y: -1 }, { x: -1, y: 0 }, { x: -1, y: 1 }],
		'S': [{ x: 1, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 }],
		'W': [{ x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 }],
		'E': [{ x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
	};
	for (let i = 0; i < 3; i++) {
		const dir = cellToCheck[direction][i];
		const newX = coord.x + dir.x;
		const newY = coord.y + dir.y;
		if (!map[newX]) { map[newX] = []; }
		if (map[newX][newY] === '#') {
			return false;
		}
	}
	return true;
};

const computeNextPositions = (bound, map, directions) => {
	const elves = [];
	const directionsMovement = {
		'N': { x: -1, y: 0 },
		'S': { x: 1, y: 0 },
		'W': { x: 0, y: -1 },
		'E': { x: 0, y: 1 },
	};

	for (let x = bound.minX; x <= bound.maxX; x++) {
		for (let y = bound.minY; y <= bound.maxY; y++) {
			if (map[x][y] !== '#') { continue; }

			let next = null;
			let possibleDirectionCount = 0;
			// If no other Elves are around, the Elf does not do anything during this round.
			// Otherwise, elves try directions
			for (let i = 0; i < directions.length; i++) {
				if (canGoInDirection(map, { x, y }, directions[i])) {
					possibleDirectionCount += 1;
					if (!next) {
						next = { x: x + directionsMovement[directions[i]].x, y: y + directionsMovement[directions[i]].y };
					}
				}
			}
			if (possibleDirectionCount === 4) {
				next = null; // No other elves around
			}
			elves.push({ x, y, nextPos: next });
		}
	}

	// Filter out elves that has the same choices than someone else
	elves.forEach(e => {
		if (!e.nextPos) return;
		const sameDir = elves.filter(other =>
			other.nextPos
			&& other.nextPos.x === e.nextPos.x
			&& other.nextPos.y === e.nextPos.y
		);
		if (sameDir.length === 1) {
			return;
		}
		sameDir.forEach((elvesToUpdate) => {
			elvesToUpdate.nextPos = null
		});
	});

	// Actually make them move
	let newBound = {
		minX: Infinity, maxX: -Infinity,
		minY: Infinity, maxY: -Infinity,
	};

	elves.forEach((elve) => {
		if (!elve.nextPos) {
			if (elve.x < newBound.minX) { newBound.minX = elve.x; }
			if (elve.x > newBound.maxX) { newBound.maxX = elve.x; }
			if (elve.y < newBound.minY) { newBound.minY = elve.y; }
			if (elve.y > newBound.maxY) { newBound.maxY = elve.y; }
			return;
		}
		if (elve.nextPos.x < newBound.minX) { newBound.minX = elve.nextPos.x; }
		if (elve.nextPos.x > newBound.maxX) { newBound.maxX = elve.nextPos.x; }
		if (elve.nextPos.y < newBound.minY) { newBound.minY = elve.nextPos.y; }
		if (elve.nextPos.y > newBound.maxY) { newBound.maxY = elve.nextPos.y; }

		map[elve.x][elve.y] = '.';
		map[elve.nextPos.x][elve.nextPos.y] = '#';
	});

	return newBound;
};

const countEmptyCells = (bound, map) => {
	let count = 0;
	for (let x = bound.minX; x <= bound.maxX; x++) {
		for (let y = bound.minY; y <= bound.maxY; y++) {
			if (map[x][y] !== '#') {
				count += 1;
			}
		}
	}
	return count;
};

const solve = (input) => {
	const map = parseInput(input);

	let bound = {
		minX: 0,
		maxX: map.length - 1,
		minY: 0,
		maxY: map[0].length - 1,
	};

	let directions = ['N', 'S', 'W', 'E'];

	for (let turn = 0; turn < 10; turn++) {
		// Simulate the elves new position & Store new min max position of elves
		bound = computeNextPositions(bound, map, directions);

		// Rotate direction orders
		const a = directions.shift();
		directions.push(a);
	}

	// After ten turn, count empty cell between min-max positions
	return countEmptyCells(bound, map);
};
