// https://adventofcode.com/2022/day/14

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
	const map = {
		width: 0,
		height: 0,
		spawn: { x: 0, y: 500 },
		_map: [],
		init(minX, minY, maxX, maxY) {
			this.width = maxY + 1;
			this.height = maxX + 1;
		},
		get(x, y) {
			return this._map[(x * this.width - 1) + y] || ".";
		},
		set(x, y, value) {
			this._map[(x * this.width - 1) + y] = value;
		},
		getAsArray() {
			const map = [];
			let x = 0;
			while (x < this.height) {
				let line = "";
				for (let y = 0; y < this.width; y++) {
					line += this.get(x, y);
				}
				map.push(line);
				x += 1;
			}
			return map;
		}
	}

	let minX = Infinity;
	let maxX = 0;
	let minY = Infinity;
	let maxY = 0;

	const blocks = input.split("\n")
		.filter(line => line.length)
		.map(line => {
			const coordinates = line.split(" -> ");
			const points = [];
			coordinates.forEach((coord) => {
				const parts = coord.split(",");
				const point = { x: +parts[1], y: +parts[0] };
				minX = Math.min(minX, point.x);
				maxX = Math.max(maxX, point.x);
				minY = Math.min(minY, point.y);
				maxY = Math.max(maxY, point.y);
				points.push(point);
			});
			return points;
		});

	// Create map
	map.init(minX, minY, maxX, maxY);
	blocks.forEach((points) => {
		points.forEach((point, i) => {
			if (i === 0) {
				map.set(point.x, point.y, "#");
				return;
			}
			let { x, y } = points[i - 1];
			while (x !== point.x || y !== point.y) {
				map.set(x, y, "#");
				if (y !== point.y) y += y > point.y ? -1 : 1;
				if (x !== point.x) x += x > point.x ? -1 : 1;
			}
			map.set(point.x, point.y, "#");
		});
	});
	return map;
};

const solve = (input) => {
	const map = parseInput(input);

	let restCount = 0;
	while (true) { // Simulation will break the loop when over
		let newPoint = { x: map.spawn.x, y: map.spawn.y, atRest: false };
		while (!newPoint.atRest && newPoint.x < map.height) {
			if (map.get(newPoint.x + 1, newPoint.y) === ".") {
				newPoint.x += 1;
			} else if (map.get(newPoint.x + 1, newPoint.y - 1) === ".") {
				newPoint.x += 1;
				newPoint.y -= 1;
			} else if (map.get(newPoint.x + 1, newPoint.y + 1) === ".") {
				newPoint.x += 1;
				newPoint.y += 1;
			} else {
				map.set(newPoint.x, newPoint.y, "S");
				newPoint.atRest = true;
			}
		}
		if (!newPoint.atRest) {
			break;
		}
		restCount += 1;
	}

	return restCount;
};
