// https://adventofcode.com/2022/day/7

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

class Command {
	constructor(log) {
		const parts = log.split('\n');
		let fullCommand = parts[0].trim();
		this.cmd = fullCommand.split(" ")[0];
		this.arg = fullCommand.split(" ")[1];
		this.output = parts.slice(1);
	}
}

class Directory {
	constructor(name, parent) {
		this.name = name;
		this.directories = [];
		this.files = [];
		this.parent = parent;
	}

	getSize() {
		let size = 0;
		this.files.forEach(file => {
			size += file.size;
		});
		this.directories.forEach(dir => {
			size += dir.getSize();
		});
		return size;
	}
}

const buildDirectory = (directory, lsCommand) => {
	if (!directory) {
		throw new Error("Directory wasn't build in parent before it was fetched");
	}
	lsCommand.output.forEach(output => {
		const outputParts = output.split(" ");
		if (outputParts[0] === "dir") { // Directory
			const childDirectory = new Directory(outputParts[1], directory);
			directory.directories.push(childDirectory);
		} else { // File
			directory.files.push({ name: outputParts[1], size: +outputParts[0] });
		}
	});
	return directory;
};

const buildDirectoryTree = (commands) => {
	let root = new Directory("/");
	let current = root;
	for (let i = 0; i < commands.length; i++) {
		const currentCmd = commands[i];
		if (currentCmd.cmd === "ls") {
			buildDirectory(current, currentCmd);
			continue;
		}
		if (currentCmd.arg === "/") {
			current = root;
		} else if (currentCmd.arg === "..") {
			current = current.parent;
		} else {
			current = current.directories.find(dir => dir.name === currentCmd.arg);
			if (!current) {
				throw new Error("A child directory wasn't created");
			}
		}
	}
	return root;
};

const buildDirectorySizeMap = (current, results) => {
	results.push({ name: current.name, size: current.getSize() });
	current.directories.forEach(dir => {
		buildDirectorySizeMap(dir, results);
	});
	return results;
};

const solve = (input) => {
	const commands = input.split("$").map(log => new Command(log.trim())).filter(cmd => cmd.cmd);

	const homeDirectory = buildDirectoryTree(commands, "/");

	const directoriesSize = buildDirectorySizeMap(homeDirectory, []);

	let sumOfSmallDirectorySizes = 0;
	directoriesSize.map(sizeInfo => {
		if (sizeInfo.size < 100000) {
			sumOfSmallDirectorySizes += sizeInfo.size;
		}
	});

	return sumOfSmallDirectorySizes;
};
