import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function generateBackup() {
    console.log("🚀 Iniciando geração de backup dos dados atuais...");

    const tables = ['ef_teachers', 'ef_classes', 'ef_students'];
    let sqlOutput = "-- 🚀 BACKUP ATUALIZADO EJA 2026\n";
    sqlOutput += "-- Gerado automaticamente em: " + new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) + "\n\n";
    sqlOutput += "BEGIN;\n\n";
    sqlOutput += "-- Limpeza de dados antigos\n";
    sqlOutput += "TRUNCATE ef_students, ef_classes, ef_teachers CASCADE;\n\n";

    for (const table of tables) {
        console.log(`Buscando dados da tabela ${table}...`);
        const { data, error } = await supabase.from(table).select('*');

        if (error) {
            console.error(`Erro ao buscar ${table}:`, error);
            continue;
        }

        if (data && data.length > 0) {
            sqlOutput += `-- 📋 DADOS DA TABELA ${table}\n`;
            const columns = Object.keys(data[0]);

            data.forEach(row => {
                const values = columns.map(col => {
                    const val = row[col];
                    if (val === null) return 'NULL';
                    if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                    return val;
                });
                sqlOutput += `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
            });
            sqlOutput += "\n";
        }
    }

    sqlOutput += "COMMIT;\n";

    const fileName = 'backup_final_2026_updated.sql';
    fs.writeFileSync(fileName, sqlOutput);
    console.log(`✅ Backup salvo com sucesso em: ${fileName}`);
}

generateBackup();
