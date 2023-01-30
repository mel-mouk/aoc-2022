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

const initScreen = () => {
	const screen = [];
	for (let x = 0; x < 6; x++) {
		let line = [];
		for (let y = 0; y < 40; y++) {
			line.push(".");
		}
		screen.push(line);
	}
	return screen;
};

const solve = (input) => {
	const commands = parseCommands(input);
	const screen = initScreen();

	let x = 1;
	let cmdIndex = 0;
	for (let tick = 0; tick < 240; tick++) {
		if (commands[cmdIndex].cmd === "addx" && commands[cmdIndex].tickLeft === 0) {
			x += commands[cmdIndex].arg;
			cmdIndex += 1;
		}

		const line = Math.floor(tick / 40);
		const col = tick % 40;
		if (Math.abs(col - x) <= 1) {
			screen[line][col] = "#";
		}

		if (!commands[cmdIndex]) {
			continue;
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
	return screen.map(line => line.join(" ")).join("\n");
};
