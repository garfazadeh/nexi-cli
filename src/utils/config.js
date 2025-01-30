import { promises as fs } from 'fs';
import yaml from 'js-yaml';
import { join } from 'path';

const configDir = join(process.env.HOME, '.config', 'nexi-cli');
const configFile = join(configDir, 'config.yml');

const defaultConfig = {
    prodSecretKey: '',
    prodCheckoutKey: '',
    testSecretKey: '',
    testCheckoutKey: '',
    production: false,
    requestLimit: 5,
    export: false,
    xApiKey: '',
    currency: 'USD',
    charge: false,
    checkoutLanguage: 'en-GB',
    consumer: true,
    consumerLocale: 'en',
    consumerType: 'B2C',
    mhcd: true,
    port: 8080,
    verbose: false,
    themeDark: {
        backgroundColor: 'rgb(20, 22, 26)',
        buttonbackgroundColor: 'rgb(72, 199, 142)',
        buttonTextColor: 'rgb(20, 22, 26)',
        linkColor: 'rgb(72, 199, 142)',
        outlineColor: 'rgb(31, 34, 41)',
        panelColor: 'rgb(36, 41, 46)',
        panelLinkColor: 'rgb(72, 199, 142)',
        panelTextColor: 'rgb(200,200,200)',
        primaryColor: 'rgb(72, 199, 142)',
        primaryOutlineColor: 'rgb(72, 199, 142)',
        textColor: 'rgb(200,200,200)',
        useLightIcons: true,
    },
    themeLight: {},
};

async function checkAndCreateConfig() {
    try {
        await fs.mkdir(configDir, { recursive: true });

        let config = {};
        if (await fileExists(configFile)) {
            const configContent = await fs.readFile(configFile, 'utf-8');
            config = yaml.load(configContent) || {};
        }

        // Merge existing config with default config, preserving existing values
        const mergedConfig = { ...defaultConfig, ...config };

        // Write the merged config back to the file
        await fs.writeFile(configFile, yaml.dump(mergedConfig), 'utf-8');
    } catch (error) {
        console.error('Error creating or updating config file:', error);
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
