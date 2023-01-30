// https://adventofcode.com/2022/day/18

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

	const result = await solve(input);

	console.log(result);
})();

const parseInput = (input) => {
	return input.split("\n")
		.filter(line => line.length)
		.map(line => {
			const parts = line.split(',');
			return { x: +parts[0], y: +parts[1], z: +parts[2] };
		});
}

const fillWithWater = (map, bound, x, y, z) => {
	if (x < bound.x.min - 1 || x > bound.x.max + 1 || y < bound.y.min - 1 || y > bound.y.max + 1 || z < bound.z.min - 1 || z > bound.z.max + 1) {
		return;
	}
	const directions = [
		{ x: 1, y: 0, z: 0 },
		{ x: -1, y: 0, z: 0 },
		{ x: 0, y: 1, z: 0 },
		{ x: 0, y: -1, z: 0 },
		{ x: 0, y: 0, z: 1 },
		{ x: 0, y: 0, z: -1 },
	];

	directions.forEach((dir) => {
		if (!map[x + dir.x]) { map[x + dir.x] = []; }
		if (!map[x + dir.x][y + dir.y]) { map[x + dir.x][y + dir.y] = []; }

		// 1 = lava, 2 = water so already visited
		if (map[x + dir.x][y + dir.y][z + dir.z] === 1 || map[x + dir.x][y + dir.y][z + dir.z] === 2) {
			return;
		}
		map[x + dir.x][y + dir.y][z + dir.z] = 2;
		return fillWithWater(map, bound, x + dir.x, y + dir.y, z + dir.z);
	});
};

const fillWithWaterIterative = (map, bound) => {
	const directions = [
		{ x: 1, y: 0, z: 0 },
		{ x: -1, y: 0, z: 0 },
		{ x: 0, y: 1, z: 0 },
		{ x: 0, y: -1, z: 0 },
		{ x: 0, y: 0, z: 1 },
		{ x: 0, y: 0, z: -1 },
	];
	const queue = [{ x: bound.x.min - 1, y: bound.y.min - 1, z: bound.z.min - 1 }];

	while (queue.length) {
		let item = queue.shift();
		let { x, y, z } = item;

		if (x < bound.x.min - 1 || x > bound.x.max + 1 || y < bound.y.min - 1 || y > bound.y.max + 1 || z < bound.z.min - 1 || z > bound.z.max + 1) {
			continue;
		}
		directions.forEach((dir) => {
			if (!map[x + dir.x]) { map[x + dir.x] = []; }
			if (!map[x + dir.x][y + dir.y]) { map[x + dir.x][y + dir.y] = []; }

			// 1 = lava, 2 = water so already visited
			if (map[x + dir.x][y + dir.y][z + dir.z] === 1 || map[x + dir.x][y + dir.y][z + dir.z] === 2) {
				return;
			}
			map[x + dir.x][y + dir.y][z + dir.z] = 2;
			queue.push({ x: x + dir.x, y: y + dir.y, z: z + dir.z });
		});
	}
};

const solve = async (input) => {
	const cubes = parseInput(input);

	// Find the x,y,z bound & build the map
	const bound = {
		x: { min: Infinity, max: -Infinity },
		y: { min: Infinity, max: -Infinity },
		z: { min: Infinity, max: -Infinity },
	};
	const map = []; // 1 = lava, 2 = water, undefined || 0 = air
	cubes.forEach(cube => {
		if (!map[cube.x]) {
			map[cube.x] = [];
		}
		if (!map[cube.x][cube.y]) {
			map[cube.x][cube.y] = [];
		}
		map[cube.x][cube.y][cube.z] = 1;
		['x', 'y', 'z'].forEach((axe) => {
			bound[axe].min = Math.min(bound[axe].min, cube[axe]);
			bound[axe].max = Math.max(bound[axe].max, cube[axe]);
		});
	});

	// Fill in with water using BFS
	fillWithWaterIterative(map, bound);

	// Everything that's not water or lava becomes lava
	for (let x = bound.x.min - 1; x <= bound.x.max + 1; x++) {
		if (!map[x]) { map[x] = []; }

		for (let y = bound.y.min - 1; y <= bound.y.max + 1; y++) {
			if (!map[x][y]) { map[x][y] = []; }

			for (let z = bound.z.min - 1; z <= bound.z.max + 1; z++) {
				if (map[x][y][z] !== 1 && map[x][y][z] !== 2) {
					cubes.push({ x, y, z });
				}
			}
		}
	}

	// Solve
	let surface = 0;
	cubes.forEach((cube, i) => {
		let cubeSurface = 6;
		cubes.forEach((otherCube, j) => {
			if (i === j) { return; }

			const dist = Math.abs(cube.x - otherCube.x) + Math.abs(cube.y - otherCube.y) + Math.abs(cube.z - otherCube.z);
			if (dist === 1) {
				cubeSurface -= 1; // Cube are touching so surface is hidden
			}
		});
		surface += cubeSurface;
	});
	return surface;
};
