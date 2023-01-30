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
	const impossibleLocations = [];
	// const wantedRow = 10; // Y line we're looking for <- 10 is for input example
	const wantedRow = 2000000; // For challenge example

	sensors.forEach((sensor, i) => {
		// Manhattan distance formula = |Xb - Xa| + |Yb - Ya|
		const dist = Math.abs(sensor.sensorX - sensor.beaconX) + Math.abs(sensor.sensorY - sensor.beaconY);

		for (let y = sensor.sensorY - dist; y <= sensor.sensorY + dist; y++) {
			if (y === wantedRow) {
				for (let x = sensor.sensorX - dist; x <= sensor.sensorX + dist; x++) {
					if ((x !== sensor.beaconX || y !== sensor.beaconY)
						&& Math.abs(sensor.sensorX - x) + Math.abs(sensor.sensorY - y) <= dist) {
						impossibleLocations[x] = true;
					}
				}
			}
		}
	});
	return Object.keys(impossibleLocations).length;
};
