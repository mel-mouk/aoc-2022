// https://adventofcode.com/2022/day/13

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
	return input.split("\n\n")
		.filter(pair => pair.length)
		.map(pair => {
			const parts = pair.split("\n");
			return { left: parts[0], right: parts[1] };
		});
};

const splitList = (list) => {
	const items = [];
	let openingCounter = 0;
	let start = 0;
	for (let i = 0; i < list.length; i++) {
		if (list[i] === '[') {
			openingCounter += 1;
		} else if (list[i] === ']') {
			openingCounter -= 1;
		} else if (list[i] === ',' && !openingCounter) {
			items.push(list.slice(start, i));
			start = i + 1;
		}
	}
	items.push(list.slice(start));
	return items;
}

const comparePair = ((leftStr, rightStr) => {
	if (!leftStr && !rightStr) {
		return true;
	}
	if (!leftStr && rightStr) {
		return true;
	}
	if (leftStr && !rightStr) {
		return false;
	}

	const leftMatch = leftStr.match(/^\[(.*)]$/);
	const rightMatch = rightStr.match(/^\[(.*)]$/);

	if (!leftMatch && rightMatch) {
		const comp = comparePair(`[${leftStr}]`, rightStr);
		return comp;
	}
	if (leftMatch && !rightMatch) {
		const comp = comparePair(leftStr, `[${rightStr}]`);
		return comp;
	}

	// Both numbers
	if (!leftMatch && !rightMatch) {
		return +leftStr <= +rightStr;
	}

	// Both list
	if (leftMatch && rightMatch) {
		const left = splitList(leftMatch[1]);
		const right = splitList(rightMatch[1]);

		for (let i = 0; i < left.length; i++) {
			if (left[i] === right[i]) {
				continue;
			}
			return comparePair(left[i], right[i]);
		}
		return true;
	}
});

const solve = (input) => {
	const pairs = parseInput(input);

	let pairOrderedIndexSum = 0;
	pairs.forEach((pair, i) => {
		pair.ordered = comparePair(pair.left, pair.right)
		if (pair.ordered) {
			pairOrderedIndexSum += (i + 1);
		}
	});

	return pairOrderedIndexSum;
};
