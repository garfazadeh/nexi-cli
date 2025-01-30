import { promises as fs } from 'fs';
import yaml from 'js-yaml';
import { join } from 'path';

const configDir = join(process.env.HOME, '.config', 'nexi-cli');
const configFile = join(configDir, 'config.yml');

async function checkAndCreateConfig() {
    try {
        await fs.mkdir(configDir, { recursive: true });

        if (!(await fileExists(configFile))) {
            const defaultConfig = {
                prodSecretKey: '',
                prodCheckoutKey: '',
                testSecretKey: '',
                testCheckoutKey: '',
                isTest: true,
                requestLimit: 5,
                saveToCSV: false,
                xApiKey: '',
                currency: 'SEK',
                charge: false,
                checkoutLanguage: 'sv-SE',
                consumer: true,
                consumerLocale: 'sv',
                consumerType: 'B2C',
                mhcd: true,
                port: 8080,
                verbose: false,
            };
            await fs.writeFile(configFile, yaml.dump(defaultConfig), 'utf-8');
        }
    } catch (error) {
        console.error('Error creating config file:', error);
    }
}

async function fileExists(path) {
    try {
        await fs.access(path);
        return true;
    } catch {
        return false;
    }
}

async function readConfig() {
    try {
        const configContent = await fs.readFile(configFile, 'utf-8');
        return yaml.load(configContent);
    } catch (error) {
        console.error('Error reading config file:', error);
    }
}

// Initialize and export config values
const configPromise = (async () => {
    await checkAndCreateConfig();
    return readConfig();
})();

export default configPromise;
