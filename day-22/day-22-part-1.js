// https://adventofcode.com/2022/day/22

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
	let [map, path] = input.split("\n\n");

	map = map.split("\n")
		.map(line => line.split("").map(val => val !== ' ' ? val : undefined));

	path = path.trim();
	const regex = /(\d+)?([RL])?/g
	const parts = [...path.matchAll(regex)];
	path = [];
	parts.forEach(p => {
		if (p[1]) path.push(p[1]);
		if (p[2]) path.push(p[2]);
	});

	return { map, path  };
};

const getNextCoord = (position, direction, map) => {
	let { x, y } = position;
	const possibleMovements = {
		'>': { x: 0, y: 1 },
		'<': { x: 0, y: -1 },
		'v': { x: 1, y: 0 },
		'^': { x: -1, y: 0 },
	};
	const movement = possibleMovements[direction];
	x = (x + movement.x) % map.length;
	y = (y + movement.y) % map[0].length;

	if (x < 0) {
		x = x + map.length;
	}
	if (y < 0) {
		y = y + map[0].length;
	}
	if (map[x][y] === '#') {
		return null; // Hit a wall, stop
	}
	if (map[x][y] === '.') {
		return { x, y }; // Free space, go
	}
	return getNextCoord({ x, y }, direction, map); // Empty cell, skip
};

const solve = (input) => {
	const { map, path } = parseInput(input);

	let position = {
		x: 0,
		y: map[0].indexOf('.'),
	};
	let direction = '>';

	const possibleDirections = ['>', 'v', '<', '^'];

	let part;
	while (part = path.shift()) {
		if (part === 'L' || part === 'R') {
			let newDirectionIndex = possibleDirections.indexOf(direction) + (part === 'L' ? (possibleDirections.length - 1) : 1);
			direction = possibleDirections[newDirectionIndex % possibleDirections.length];
		} else {
			for (let i = 0; i < +part; i++) {
				const nextCoord = getNextCoord(position, direction, map);
				if (!nextCoord) break;
				position.x = nextCoord.x;
				position.y = nextCoord.y;
			}
		}
	}
	const directionValues = { '>': 0, 'v': 1, '<': 2, '^': 3 };
	// Rows & cols start at 1
	const finalX = position.x + 1;
	const finalY = position.y + 1;
	const directionValue = directionValues[direction];

	return 1000 * finalX + 4 * finalY + directionValue;
};
