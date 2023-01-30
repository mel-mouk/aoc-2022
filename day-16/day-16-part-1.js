// https://adventofcode.com/2022/day/16

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
	const valves = {};
	input.split("\n")
		.filter(line => line.length)
		.forEach(line => {
			// Second part can be plural or singular, so we need the ? after the s to make them optionals
			const parts = line.match(/^Valve (.*) has flow rate=(.*); tunnels? leads? to valves? (.*)$/);
			valves[parts[1]] = {
				flowRate: +parts[2],
				tunnels: parts[3].split(", "),
			};
		});
	return valves;
};

const computePressureRelease = (valves, valvesOpened) => {
	let pressure = 0;
	valvesOpened.forEach(id => {
		pressure += valves[id].flowRate;
	});
	return pressure;
};

const cache = {};
const computeMaxPressureFromLocation = (valves, valvesOpened, location, visited, turnLeft) => {
	if (turnLeft === 0) return { pressure: 0, path: []};

	const cacheKey = `${location},${valvesOpened.sort().join("-")},${turnLeft}`;
	if (cache[cacheKey] !== undefined) return cache[cacheKey];

	if (!visited.includes(location)) visited.push(location);

	let max = 0;
	let maxPath = [];

	if (!valvesOpened.includes(location) && valves[location].flowRate > 0) {
		// Open a valve
		const nextTurnInfo = computeMaxPressureFromLocation(valves, [...valvesOpened, location], location, [...visited], turnLeft - 1);
		max = nextTurnInfo.pressure;
		maxPath = nextTurnInfo.path;
	}

	valves[location].tunnels.forEach(tunnel => {
		const nextTurnInfo = computeMaxPressureFromLocation(valves, valvesOpened, tunnel, [...visited], turnLeft - 1);
		if (nextTurnInfo.pressure > max) {
			max = nextTurnInfo.pressure;
			maxPath = nextTurnInfo.path;
		}
	});

	const res = {
		pressure: max + computePressureRelease(valves, valvesOpened),
		path: [location, ...maxPath]
	};
	cache[cacheKey] = res;
	return res;
}

const solve = (input) => {
	const valves = parseInput(input);

	const result = computeMaxPressureFromLocation(valves, [], 'AA', [], 30);

	return result.pressure; // Result also contain the path to help debugging
};
