
const https = require('https');

function getHolidays(year) {
    return new Promise((resolve, reject) => {
        https.get(`https://brasilapi.com.br/api/feriados/v1/${year}`, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function run() {
    try {
        const holidays = await getHolidays(2026);
        console.log('Search for 2026-03-05:');
        const match = holidays.find(h => h.date === '2026-03-05');
        if (match) {
            console.log('FOUND:', match);
        } else {
            console.log('NOT FOUND in holidays.');
        }
        
        // Also check for 2025 just in case
        const holidays2025 = await getHolidays(2025);
         const match2025 = holidays2025.find(h => h.date === '2025-03-05');
         if (match2025) {
             console.log('FOUND in 2025:', match2025);
         }
    } catch (err) {
        console.error(err);
    }
}

run();
