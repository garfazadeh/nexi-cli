#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define the commands and their corresponding sections in the README.md
const commands = [
    { name: 'fetch-payment', section: 'fetch-payment' },
    { name: 'create-payload', section: 'create-payload' },
    { name: 'create-checkout', section: 'create-checkout' },
    { name: 'create-completed-checkout', section: 'create-completed-checkout' },
    { name: 'terminate-payment', section: 'terminate-payment' },
];

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Path to the README.md file
const readmePath = path.join(__dirname, 'README.md');

// Read the README.md file
let readmeContent = fs.readFileSync(readmePath, 'utf8');

// Generate help output for each command and update the README.md
commands.forEach(({ name, section }) => {
    const helpOutput = execSync(`nexi-cli ${name} --help`).toString();
    const startMarker = `### ${section}\n\n\`\`\``;
    const endMarker = '```';
    const startIndex = readmeContent.indexOf(startMarker);
    const endIndex = readmeContent.indexOf(
        endMarker,
        startIndex + startMarker.length
    );

    if (startIndex !== -1 && endIndex !== -1) {
        const before = readmeContent.substring(
            0,
            startIndex + startMarker.length
        );
        const after = readmeContent.substring(endIndex);
        readmeContent = `${before}\n${helpOutput}${after}`;
    }
});

// Write the updated content back to README.md
fs.writeFileSync(readmePath, readmeContent);

console.log('README.md updated with the latest help commands.');
