// https://adventofcode.com/2022/day/20

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
		.map(number => +number);
}

const solve = (input) => {
	const originalList = parseInput(input);

	// Apply decryption key
	const list = originalList.map((val) => val * 811589153);

	const currentListIndex = [...list].map((val, i) => i);

	for (let turn = 0; turn < 10; turn++) {
		// Switch index instead of values, so it's easier to use
		for (let i = 0; i < list.length; i++) {
			const value = list[i];
			let indexOfItemToMove = currentListIndex.indexOf(i);
			const valueOfItemToMove = currentListIndex[indexOfItemToMove];

			let newIndex = (indexOfItemToMove + value) % (list.length - 1);

			// Move item
			currentListIndex.splice(indexOfItemToMove, 1);
			currentListIndex.splice(newIndex, 0, valueOfItemToMove);
		}
	}

	// 1000th, 2000th and 3000th values after the value 0
	const indexOfZeroInList = list.indexOf(0);
	const indexOfIndexOfZero = currentListIndex.indexOf(indexOfZeroInList);

	const values = [
		list[currentListIndex[(1000 + indexOfIndexOfZero) % list.length]],
		list[currentListIndex[(2000 + indexOfIndexOfZero) % list.length]],
		list[currentListIndex[(3000 + indexOfIndexOfZero) % list.length]],
	]

	return values.reduce((cur, acc) => {
		return cur + acc;
	}, 0);
};
