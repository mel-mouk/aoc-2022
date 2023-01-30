// https://adventofcode.com/2022/day/17

// The trick here is that the process is cyclic so you don't actually need to perform the full simulation

const getInput = () => {
	return new Promise((resolve) => {
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

const rocks = [
	[
		[1, 1, 1, 1]
	],
	[
		[0, 1, 0],
		[1, 1, 1],
		[0, 1, 0],
	],
	[
		[0, 0, 1],
		[0, 0, 1],
		[1, 1, 1],
	],
	[
		[1],
		[1],
		[1],
		[1],
	],
	[
		[1, 1],
		[1, 1],
	],
];
const mapWidth = 7;
let highestX = undefined;

const findSpawnPoint = () => {
	if (highestX === undefined) {
		return { x: 3, y: 2 };
	}
	return { x: highestX + 4, y: 2 };
};

const addRockToMap = (map, rock) => {
	const newMap = map;

	rock.shape.forEach((line, i) => {
		line.forEach((cell, j) => {
			if (cell === 0) { return; }

			const cellX = rock.x + i;
			if (!highestX || cellX > highestX) {
				highestX = cellX;
			}
			const cellY = rock.y + j;
			newMap[cellX * mapWidth + cellY] = 1;
		});
	})
	return newMap;
}

const cache = {};
const diffCache = {};

const solve = (input) => {
	const gasEffects = input.split('').filter(l => l !== '\n');
	let selectedShape = 0;
	let selectedEffect = 0;

	let map = []; // Y grows toward the right, X grows toward the top. Coords saved as x * mapWidth + y;

	const target = 1000000000000;
	for (let rockCount = 1; rockCount < target; rockCount++) {
		const spawn = findSpawnPoint(map);
		let newRock = {
			shape:[...rocks[selectedShape]].reverse(), // Because we use reversed x coordinates
			x: spawn.x,
			y: spawn.y,
			stopped: false,
		};

		while (!newRock.stopped) {
			const effect = gasEffects[selectedEffect];

			// Detect if the move would cause the rock to go into the wall or another rock - If so, do nothing
			let effectCauseCollusion = false;
			const newY = effect === '<' ? newRock.y - 1 : newRock.y + 1;

			newRock.shape.forEach((line, i) => {
				if (effectCauseCollusion) return;

				line.forEach((cell, j) => {
					if (effectCauseCollusion) return;

					if (cell === 0) { return; }

					const cellX = newRock.x + i;
					const cellY = newY + j;
					if (cellX < 0 || cellY < 0 || cellY >= mapWidth || map[cellX * mapWidth + cellY] === 1) {
						effectCauseCollusion = true;
					}
				});
			});

			if (!effectCauseCollusion) {
				newRock.y = newY;
			}
			selectedEffect = (selectedEffect + 1) % gasEffects.length;

			// Falling & check if we stopped on something
			const newX = newRock.x - 1;
			let descentCauseCollusion = false;
			newRock.shape.forEach((line, i) => {
				if (descentCauseCollusion) return;

				line.forEach((cell, j) => {
					if (descentCauseCollusion) return;

					if (cell === 0) { return; }

					const cellX = newX + i;
					const cellY = newRock.y + j;
					if (cellX < 0 || cellY < 0 || cellY >= mapWidth || map[cellX * mapWidth + cellY] === 1) {
						descentCauseCollusion = true;
					}
				});
			});

			if (descentCauseCollusion) {
				map = addRockToMap(map, newRock);
				newRock.stopped = true;
			} else {
				newRock.x = newX;
			}
		}

		const cacheKey = `${selectedShape}-${selectedEffect}`;
		if (cache[cacheKey]) {
			diffCache[cacheKey] = {
				rockStopped: rockCount - cache[cacheKey].rockStopped,
				highestX: highestX - cache[cacheKey].highestX,
			};
			// If there's a multiple of full cycle left ?
			if (((target ) - rockCount) % diffCache[cacheKey].rockStopped === 0) {
				const fullCycleLeftCount = ((target ) - rockCount) / diffCache[cacheKey].rockStopped;
				return highestX + (fullCycleLeftCount * diffCache[cacheKey].highestX) + 1;
			}
		}
		cache[`${selectedShape}-${selectedEffect}`] = { rockStopped: rockCount, highestX };

		selectedShape = (selectedShape + 1) % rocks.length;
	}

	return findSpawnPoint(map).highestX;
};
