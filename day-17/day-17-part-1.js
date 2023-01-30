// https://adventofcode.com/2022/day/17

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

const rocks = [
	[
		['#', '#', '#', '#']
	],
	[
		['.', '#', '.'],
		['#', '#', '#'],
		['.', '#', '.']
	],
	[
		['.', '.', '#'],
		['.', '.', '#'],
		['#', '#', '#']
	],
	[
		['#'],
		['#'],
		['#'],
		['#'],
	],
	[
		['#', '#'],
		['#', '#'],
	],
];
const mapWidth = 7;

const findSpawnPoint = (map) => {
	if (!Object.keys(map).length) {
		return { x: 3, y: 2 };
	}
	const maxHeight = Math.floor(Math.max(...Object.keys(map)) / mapWidth) + 1;
	return { x: maxHeight + 3, y: 2 };
};

const addRockToMap = (map, rock) => {
	const newMap = [...map];
	rock.shape.forEach((line, i) => {
		line.forEach((cell, j) => {
			if (cell === '.') { return; }

			const cellX = rock.x + i;
			const cellY = rock.y + j;
			newMap[cellX * mapWidth + cellY] = '#';
		});
	})
	return newMap;
}

const solve = (input) => {
	const gasEffects = input.split('').filter(l => l !== '\n');
	let selectedShape = 0;
	let selectedEffect = 0;

	let map = []; // Y grows toward the right, X grows toward the top. Coords saved as x * mapWidth + y;

	for (let rockCount = 0; rockCount < 2021; rockCount++) {
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

					if (cell === '.') { return; }

					const cellX = newRock.x + i;
					const cellY = newY + j;
					if (cellX < 0 || cellY < 0 || cellY >= mapWidth || map[cellX * mapWidth + cellY] === '#') {
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

					if (cell === '.') { return; }

					const cellX = newX + i;
					const cellY = newRock.y + j;
					if (cellX < 0 || cellY < 0 || cellY >= mapWidth || map[cellX * mapWidth + cellY] === '#') {
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
		selectedShape = (selectedShape + 1) % rocks.length;
	}

	return findSpawnPoint(map).x;
};
