
const fetch = require('node-fetch');

async function checkHolidays() {
    const year = 2026;
    try {
        const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`);
        const holidays = await response.json();
        console.log('Holidays for 2026:');
        holidays.forEach(h => {
            if (h.date === '2026-03-05') {
                console.log('Match found: ', h);
            }
        });
        console.log('List of all holidays:');
        console.log(JSON.stringify(holidays, null, 2));
    } catch (err) {
        console.error('Error fetching holidays:', err);
    }
}

checkHolidays();
