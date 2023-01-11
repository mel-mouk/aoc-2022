// https://adventofcode.com/2022/day/6

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

const solve = (input) => {
	for (let i = 14; i < input.length; i++) {
		const subArray = input.slice(i - 14, i).split("");
		subArray.sort();
		let x = 1;
		while (x < subArray.length && subArray[x] !== subArray[x - 1]) {
			x++;
		}
		if (x === subArray.length) {
			return i;
		}
	}
	throw new Error("Not found");
};
