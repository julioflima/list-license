const axios = require('axios');
const cheerio = require('cheerio');

const packageJson = require('./_package.json');

async function getLicenseInfo(packageName, version) {
    try {
        const formattedVersion = version.replace(/[^0-9.]/g, '');
        const url = `https://www.npmjs.com/package/${packageName}/v/${formattedVersion}`;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const licenseText = $('h3:contains("License")').next('p').text().trim();
        await (new Promise(resolve => setTimeout(resolve, 1000)));
        return licenseText;
    } catch (error) {
        console.error('Error fetching license information:', error);
        await (new Promise(resolve => setTimeout(resolve, (Math.floor(Math.random() * 10) + 1)*1000)));
        return 'Not Found License';
    }
}

async function getLicensesFromDependencies(packageJson) {
    const dependencies = packageJson.dependencies || {}
    const devDependencies = packageJson.devDependencies || {};
    const allDependencies = { ...dependencies, ...devDependencies };

    const results = {};
    for (const [packageName, version] of Object.entries(allDependencies)) {
        const license = await getLicenseInfo(packageName, version);
        results[packageName] = { version, license };
        console.log(`${packageName}: ${version} - ${license}`);
    }
    return results;
}

getLicensesFromDependencies(packageJson)
    .then(licenses => {
        console.log(JSON.stringify(licenses, null, 2));
    })
    .catch(error => {
        console.error('Error:', error);
    });

// getLicenseInfo('@typescript-eslint/eslint-plugin', "^5.43.0")
//     .then(licenses => {
//         console.log(licenses);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
