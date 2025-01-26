import chalk from 'chalk';

export default function updateLoader(current, total, message) {
    const length = 50; // length of the loader bar
    const progress = Math.floor((current / total) * length);
    const loader = `${chalk.blue.bold(message)}: ${chalk.green('█').repeat(progress)}${chalk
        .dim('░')
        .repeat(length - progress)} ${chalk.dim(current)}/${chalk.bold(total)}`;
    process.stdout.write(`\r${loader}`);
}
