export default function updateLoader(current, total, message) {
	const length = 50; // length of the loader bar
	const progress = Math.floor((current / total) * length);
	const loader = `${message}: [${"#".repeat(progress)}${"-".repeat(
		length - progress
	)}] ${current}/${total}`;
	process.stdout.write(`\r${loader}`);
}