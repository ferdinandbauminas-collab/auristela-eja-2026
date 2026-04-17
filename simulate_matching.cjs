
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

// Logic from dashboard_supabase.html
const normC = (name) => {
    if (!name) return "";
    let n = name.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    n = n.replace(/MODULO/g, "").replace(/MOD/g, "").replace(/TECNICO/g, "").replace(/\s+/g, "");
    n = n.replace(/ALTE/g, "ALT");
    if (n.startsWith("ALT") && n.length > 3) n = n.substring(3) + "ALT";
    if (n.startsWith("MARK") && n.length > 4) n = n.substring(4) + "MARK";
    if (n.startsWith("INFO") && n.length > 4) n = n.substring(4) + "INFO";
    n = n.replace(/INFO/g, "").replace(/III/g, "3").replace(/IV/g, "4").replace(/V/g, "5").replace(/I/g, "1");
    return n.trim();
};
const normD = (name) => (!name ? "" : name.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ORIENTADA/g, "").replace(/ELETIVAS/g, "ELETIVA").replace(/\s+/g, "").trim());
const TEACHER_ALIAS = {
    "ASSUNCAO": "JOSE DE ASSUNCAO SOUSA BARBOSA",
    "ASSUNÇÃO": "JOSE DE ASSUNCAO SOUSA BARBOSA",
    "CARMEM": "CARMEN SILVIA NUNES DE MOURA SANTOS",
    "CARMEN SILVIA": "CARMEN SILVIA NUNES DE MOURA SANTOS",
    "DANIEL": "DANIEL MAGALHAES CHAVES",
    "DANIEL MAGALHAES": "DANIEL MAGALHAES CHAVES",
    "DANIEL MAGALHÃES": "DANIEL MAGALHAES CHAVES",
    "DENILSON": "DENILSON DAVID DA SILVA SANTOS",
    "EUNICE": "MARIA EUNICE LIRA TEIXEIRA ANDRADE",
    "MARIA EUNICE": "MARIA EUNICE LIRA TEIXEIRA ANDRADE",
    "FRANCINEUDA": "FRANCINEUDA DA SILVA SOUSA",
    "FRANCINELDA": "FRANCINEUDA DA SILVA SOUSA", 
    "FRANCISCA": "FRANCISCA DA SILVA SOUSA",
    "FRANCISCA DA SILVA": "FRANCISCA DA SILVA SOUSA",
    "HELANE": "HELANNE BEATRIZ SILVA OLIVEIRA",
    "HELANNE": "HELANNE BEATRIZ SILVA OLIVEIRA",
    "JANDIRA": "CARMEM JANDIRA SILVA DE OLIVEIRA",
    "JOANILSON": "JOANILSON OLIVEIRA DE QUEIROZ",
    "JORGE": "JORGE LUÍS SÁ BEZERRA",
    "LENINHA": "WILSILENE DOS SANTOS OLIVEIRA BRANDÃO",
    "WILSILENE": "WILSILENE DOS SANTOS OLIVEIRA BRANDÃO",
    "LINDELVANIA": "LINDELVÂNIA DE SOUSA ALMEIDA",
    "LINDELVÂNIA": "LINDELVÂNIA DE SOUSA ALMEIDA",
    "LUCIANO": "LUCIANO DE OLIVEIRA CHAVES",
    "MARCOS": "MARCOS AURELIO MATOS DOS SANTOS",
    "MIZAEL": "MIZAEL CARLOS GONCALVES DE SOUSA",
    "PAULO": "PAULO PEREIRA GOUDINHO",
    "WESLEY": "WESLEY BEZERRA PORTELA FREITAS",
    "WILSON": "WILSON BENTO GUILHERME MAGALHAES",
    "EDNARDO": "EDNARDO FERREIRA DE SOUSA",
    "FRANCISCO JUNIOR": "FRANCISCO JR",
    "CARLOS AUGUSTO": "CARLOS AUGUSTO ALVES DE OLIVEIRA"
};
const normalize = (name) => !name ? "" : name.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
const isSameT = (tSchedule, tAttendance) => {
    if (!tSchedule || !tAttendance) return false;
    const s = normalize(tSchedule);
    const a = normalize(tAttendance);
    if (s === a) return true;
    const aliasMatch = TEACHER_ALIAS[a];
    if (aliasMatch && normalize(aliasMatch) === s) return true;
    return s.includes(a) || a.includes(s);
};

async function run() {
    try {
        console.log('Fetching data...');
        const att = await getSupabase('ef_attendance?date=gte.2026-03-05&date=lt.2026-03-06');
        const sch = await getSupabase('ef_schedule');
        
        console.log(`Analyzing ${att.length} attendance records against ${sch.length} schedule entries...`);
        
        const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        
        let matchCount = 0;
        att.forEach(record => {
            const recordDay = record.date.split('T')[0];
            const recordDate = new Date(recordDay + 'T12:00:00');
            const recordDayName = dayNames[recordDate.getDay()];
            
            const potentialMatches = sch.filter(s => {
                const tMatch = isSameT(s.teacher_name, record.teacher_name);
                const cMatch = normC(s.class_group) === normC(record.class_name);
                const dMatch = (normD(s.discipline) === normD(record.discipline) || s.discipline.toUpperCase().includes(normD(record.discipline)));
                const dayMatch = s.day_of_week === recordDayName;
                
                return tMatch && cMatch && dMatch && dayMatch;
            });
            
            if (potentialMatches.length > 0) {
                matchCount++;
                // console.log(`MATCH: ${record.teacher_name} in ${record.class_name} (${record.discipline})`);
            } else {
                console.log(`NO MATCH: T:${record.teacher_name}, C:${record.class_name}, D:${record.discipline}, Day:${recordDayName}`);
                // Debug details for the first few fails
                if (matchCount < 10) {
                    const tFailed = !sch.some(s => isSameT(s.teacher_name, record.teacher_name));
                    const cFailed = !sch.some(s => normC(s.class_group) === normC(record.class_name));
                    const dFailed = !sch.some(s => normD(s.discipline) === normD(record.discipline) || s.discipline.toUpperCase().includes(normD(record.discipline)));
                    const dayFailed = !sch.some(s => s.day_of_week === recordDayName);
                    
                    console.log(`  - T fail: ${tFailed}, C fail: ${cFailed}, D fail: ${dFailed}, Day fail: ${dayFailed}`);
                }
            }
        });
        
        console.log(`Total valid records for 05/03: ${matchCount}`);
        
    } catch (err) {
        console.error(err);
    }
}

run();
