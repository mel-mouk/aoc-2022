// https://adventofcode.com/2022/day/10

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

const parseCommands = (input) => {
	return input.split("\n")
		.filter(line => line.length)
		.map(line => {
			const part = line.split(" ");
			return { cmd: part[0], arg: part[1] ? +part[1] : undefined };
		});
};

const solve = (input) => {
	const commands = parseCommands(input);

	let x = 1;
	let cmdIndex = 0;
	const signalStrengths = [];
	for (let tick = 0; tick <= 220; tick++) {
		if ((tick - 20) % 40 === 0) {
			signalStrengths.push(x * tick);
		}

		if (commands[cmdIndex].cmd === "addx" && commands[cmdIndex].tickLeft === 0) {
			x += commands[cmdIndex].arg;
			cmdIndex += 1;
		}

		if (commands[cmdIndex].cmd === "noop") {
			cmdIndex += 1;
			continue;
		}

		if (commands[cmdIndex].cmd === "addx") {
			if (commands[cmdIndex].tickLeft === undefined) {
				commands[cmdIndex].tickLeft = 1;
			} else {
				commands[cmdIndex].tickLeft -= 1;
			}
		}
	}
	return signalStrengths.reduce((acc, val) => acc + val, 0);
};
