
const fs = require('fs');
const content = fs.readFileSync('populate_schedule.sql', 'utf8');
const lines = content.split('\n');

const teachersByDiscipline = {};

lines.forEach(line => {
    if (line.includes('MOD V')) {
        // Exemplo: INSERT INTO ef_schedule (...) VALUES ('Segunda-feira', 1, 'MOD V A', 'PROGRAMAÇÃO DE SISTEMAS', 'MARCOS AURELIO MATOS DOS SANTOS');
        const match = line.match(/VALUES\s*\((.*)\)/);
        if (match) {
            const values = match[1].split(',').map(v => v.trim().replace(/'/g, ''));
            const [day, slot, group, discipline, teacher] = values;
            
            if (!teachersByDiscipline[discipline]) {
                teachersByDiscipline[discipline] = {};
            }
            if (!teachersByDiscipline[discipline][group]) {
                teachersByDiscipline[discipline][group] = teacher;
            }
        }
    }
});

console.log(JSON.stringify(teachersByDiscipline, null, 2));
