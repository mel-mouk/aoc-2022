// https://adventofcode.com/2022/day/5

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
	let [cratesInput, commandsInput] = input.split("\n\n");
	cratesInput = cratesInput.split("\n");

	let crates = [];
	for (let i = cratesInput.length - 2; i >= 0; i--) {
		for (let y = 1; y < cratesInput[i].length; y += 4) {
			const crateIndex = Math.floor(y / 4);
			if (!crates[crateIndex]) crates[crateIndex] = [];
			if (cratesInput[i][y] !== ' ') {
				crates[crateIndex].push(cratesInput[i][y]);
			}
		}
	}

	commandsInput = commandsInput.split("\n").filter(line => line.length);
	const commands = [];
	commandsInput.forEach(cmd => {
		const parts = cmd.match(/move (\d*) from (\d*) to (\d*)/);
		commands.push({ amount: +parts[1], from: +parts[2] - 1, to: +parts[3] - 1 });
	});

	return [crates, commands];
}

const solve = (input) => {
	const [crates, commands] = parseInput(input);

	commands.forEach(cmd => {
		let items = crates[cmd.from].splice(cmd.amount * -1);
		crates[cmd.to].push(...items);
	});

	return crates.map(c => c.pop()).join("");
};
