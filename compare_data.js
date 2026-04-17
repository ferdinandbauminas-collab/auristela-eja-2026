
const https = require('https');

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';

function getSupabase(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: SUPABASE_URL.replace('https://', ''),
            path: '/rest/v1/' + path,
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': 'Bearer ' + SUPABASE_KEY
            }
        };
        https.get(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function run() {
    try {
        console.log('--- MARCOS SCHEDULE (THURS) ---');
        const schedule = await getSupabase('ef_schedule?teacher_name=eq.MARCOS%20AURELIO%20MATOS%20DOS%20SANTOS&day_of_week=eq.Quinta-feira');
        schedule.forEach(s => {
            console.log(`Class: ${s.class_group}, Discipline: ${s.discipline}`);
        });

        console.log('\n--- ATTENDANCE DATA (2026-03-05) ---');
        const attendance = await getSupabase('ef_attendance?date=gte.2026-03-05&date=lt.2026-03-06');
        attendance.forEach(a => {
            console.log(`Teacher: ${a.teacher_name}, Class: ${a.class_name}, Discipline: ${a.discipline}`);
        });

    } catch (err) {
        console.error(err);
    }
}

run();
