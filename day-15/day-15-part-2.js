// https://adventofcode.com/2022/day/15

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
	const sensorLines = input.split("\n").filter(line => line.length);
	const sensors = [];
	sensorLines.forEach(line => {
		const [_, sensorX, sensorY, beaconX, beaconY] = line.match(/^Sensor at x=(.*), y=(.*): closest beacon is at x=(.*), y=(.*)$/);
		sensors.push({
			sensorX: +sensorX,
			sensorY: +sensorY,
			beaconX: +beaconX,
			beaconY: +beaconY,
		});
	});
	return sensors;
};

const solve = (input) => {
	const sensors = parseInput(input);
	// const maxAreaCoord = 20; // Input example
	const maxAreaCoord = 4000000; // Input challenge

	for (let y = 0; y < maxAreaCoord; y++) {
		let ranges = [];
		sensors.forEach(sensor => {
			const dist = Math.abs(sensor.sensorX - sensor.beaconX) + Math.abs(sensor.sensorY - sensor.beaconY);
			if (Math.abs(sensor.sensorY - y) <= dist) {
				ranges.push({
					min: Math.max((sensor.sensorX - dist) + Math.abs(sensor.sensorY - y), 0),
					max: Math.min((sensor.sensorX + dist) - Math.abs(sensor.sensorY - y), maxAreaCoord),
				});
			}
		});
		ranges.sort((a, b) => a.min - b.min);
		const reduceRange = [ranges[0]];
		let currentRange = 0;
		ranges.forEach((range) => {
			if (range.min > reduceRange[currentRange].max) {
				reduceRange.push(range);
				currentRange += 1;
				return;
			}
			reduceRange[currentRange].max = Math.max(reduceRange[currentRange].max, range.max);
		});

		let xFound = undefined;
		if (reduceRange.length === 1) {
			if (reduceRange[0].min === 0 && reduceRange[0].max === maxAreaCoord) {
				continue;
			}
			xFound = reduceRange[0].min === 0 ? reduceRange[0].max : reduceRange[0].min;
		} else {
			xFound = reduceRange[0].max + 1;
		}

		return xFound * 4000000 + y;
	}
	throw new Error("No result found");
};
