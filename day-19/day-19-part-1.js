// https://adventofcode.com/2022/day/19
// Valid but bad performances

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
		.map(line => {
			const groups = line.match(/Blueprint (.*): Each ore robot costs (.*) ore. Each clay robot costs (.*) ore. Each obsidian robot costs (.*) ore and (.*) clay. Each geode robot costs (.*) ore and (.*) obsidian./);
			return {
				id: +groups[1],
				[RESOURCES.oreRobot]: { [RESOURCES.ore]: +groups[2] },
				[RESOURCES.clayRobot]: { [RESOURCES.ore]: +groups[3] },
				[RESOURCES.obsidianRobot]: { [RESOURCES.ore]: +groups[4], [RESOURCES.clay]: +groups[5] },
				[RESOURCES.geodeRobot]: { [RESOURCES.ore]: +groups[6], [RESOURCES.obsidian]: +groups[7] },
			};
		});
};

const RESOURCES = {
	ore: 0,
	clay: 1,
	obsidian: 2,
	geode: 3,
	oreRobot: 4,
	clayRobot: 5,
	obsidianRobot: 6,
	geodeRobot: 7
}

let cache = {};
let meta = {};
const computeGeodeProduced = (blueprint, resources, minutesLeft) => {
	if (minutesLeft === 0) {
		return resources;
	}
	const cacheKey = `${resources.join(',')}${minutesLeft}`;
	if (cache[cacheKey]) return cache[`${resources.join(',')}${minutesLeft}`]; // This divide execution time by 3X

	const states = [];
	// Find next state for each robot if we can build them before the end
	[RESOURCES.oreRobot, RESOURCES.clayRobot, RESOURCES.obsidianRobot, RESOURCES.geodeRobot].forEach((robotType) => {
		// If you don't need that robot, skip
		if (meta.maxRobots[robotType] === resources[robotType]) {
			return;
		}

		const newState = [...resources];
		const pair = [
			[RESOURCES.ore, RESOURCES.oreRobot],
			[RESOURCES.clay, RESOURCES.clayRobot],
			[RESOURCES.obsidian, RESOURCES.obsidianRobot],
			[RESOURCES.geode, RESOURCES.geodeRobot],
		]

		// Check that we do have the robot to end up with the right resources at some point
		for (let i = 0; i < pair.length; i++) {
			const [resource, robot] = pair[i];
			if (!blueprint[robotType][resource]) {
				continue; // No need
			}
			if (!newState[robot]) { // Don't have the robot to gain that resource
				return;
			}
		}

		let currentMinuteLeft = minutesLeft;
		let canBuild = false;
		// If we do, compute the state we will be in once we have what's needed for this robot.
		// For each upcoming turn, including this one, all of our robot produce one unit
		while (!canBuild && currentMinuteLeft) {
			// Try to build
			canBuild = pair.every(pair => {
				const [resource] = pair;
				if (!blueprint[robotType][resource]) {
					return true;
				}
				return newState[resource] >= blueprint[robotType][resource];
			});

			// Resource for this turn
			if (newState[RESOURCES.oreRobot]) { newState[RESOURCES.ore] += newState[RESOURCES.oreRobot]; }
			if (newState[RESOURCES.clayRobot]) { newState[RESOURCES.clay] += newState[RESOURCES.clayRobot]; }
			if (newState[RESOURCES.obsidianRobot]) { newState[RESOURCES.obsidian] += newState[RESOURCES.obsidianRobot]; }
			if (newState[RESOURCES.geodeRobot]) { newState[RESOURCES.geode] += newState[RESOURCES.geodeRobot]; }

			currentMinuteLeft -= 1;
		}

		// If that state is after the end, return the end state
		if (!currentMinuteLeft) {
			newState.minuteLeft = 0;
			states.push(newState);
			return;
		}

		// If we're here, then end of turn is the robot being build then we move on
		newState[robotType] += 1;
		pair.forEach(pair => {
			const [resource] = pair;
			if (!blueprint[robotType][resource]) {
				return;
			}
			newState[resource] -= blueprint[robotType][resource];
		});

		newState.minuteLeft = currentMinuteLeft;
		states.push(newState);
	});

	let best = [...resources];
	states.forEach((state) => {
		let result = computeGeodeProduced(blueprint, state, state.minuteLeft);
		if (result[RESOURCES.geode] >= best[RESOURCES.geode]) {
			best = result;
		}
	});

	cache[cacheKey] = best;
	return best;
};

const computeQualityLevel = (blueprint) => {
	cache = {};
	meta = {
		maxRobots: {
			[RESOURCES.oreRobot]: Infinity,
			[RESOURCES.clayRobot]: Infinity,
			[RESOURCES.obsidianRobot]: Infinity,
			[RESOURCES.geodeRobot]: Infinity,
		}
	};
	// Compute max robot needed
	// Only geode robot cost obsidian
	meta.maxRobots[RESOURCES.obsidianRobot] = blueprint[RESOURCES.geodeRobot][RESOURCES.obsidian];
	// Only obsidian robot cost clay
	meta.maxRobots[RESOURCES.clayRobot] = meta.maxRobots[RESOURCES.obsidianRobot] * blueprint[RESOURCES.obsidianRobot][RESOURCES.clayRobot];

	const result = computeGeodeProduced(blueprint, [0, 0, 0, 0, 1, 0, 0, 0], 24);
	const geodeProduced = result[RESOURCES.geode];

	return blueprint.id * geodeProduced;
};

const solve = (input) => {
	const blueprints = parseInput(input);
	let score = 0;
	blueprints.forEach((blueprint) => {
		score += computeQualityLevel(blueprint);
	});
	return score;
};
