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
	for (let i = 4; i < input.length; i++) {
		const subArray = input.slice(i - 4, i).split("");
		subArray.sort();
		if (subArray[0] !== subArray[1]
			&& subArray[1] !== subArray[2]
			&& subArray[2] !== subArray[3]) {
			return i;
		}
	}
	throw new Error("Not found");
};
