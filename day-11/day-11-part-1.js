// https://adventofcode.com/2022/day/11

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
	const monkeys = [];
	const monkeysData = input.split("\n\n");
	monkeysData.forEach(data => {
		let monkey = { inspectionCount: 0 };

		const lines = data.split("\n").map(line => line.trim());
		monkey.items = lines[1].split("Starting items: ")[1].split(", ");
		monkey.operation = lines[2].split("Operation: new = ")[1].split(" ");
		monkey.moduloTest = +lines[3].split("Test: divisible by ")[1];
		monkey.throwTo = {
			true: +lines[4].split("If true: throw to monkey ")[1],
			false: +lines[5].split("If false: throw to monkey ")[1],
		}

		monkeys.push(monkey);
	});

	return monkeys;
};

const compute = (operation, old) => {
	const operators = {
		'+': (a, b) => a + b,
		'-': (a, b) => a - b,
		'*': (a, b) => a * b,
		'/': (a, b) => a / b,
	};
	let x = operation[0] === 'old' ? +old : +operation[0];
	let y = operation[2] === 'old' ? +old : +operation[2];
	return operators[operation[1]](x, y);
};

const solve = (input) => {
	const monkeys = parseInput(input);
	for (let round = 0; round < 20; round ++) {
		monkeys.forEach((monkey, i) => {
			while (monkey.items.length) {
				monkey.inspectionCount += 1;
				let item = monkey.items.shift();

				// Monkey inspection (operation)
				item = compute(monkey.operation, item);

				// Relief (worry level divded by 3 and rounded down)
				item = Math.floor(item / 3);

				// Throw to monkey based on test (at the end of the recipient monkey's list)
				monkeys[monkey.throwTo[item % monkey.moduloTest === 0]].items.push(item);
			}
		});
	}
	const mostActives = monkeys.sort((a, b) => b.inspectionCount - a.inspectionCount).slice(0, 2);
	return mostActives[0].inspectionCount * mostActives[1].inspectionCount;
};
