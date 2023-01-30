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

	const result = solve(input);

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

const solve = (input) => {
	const cubes = parseInput(input);

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
