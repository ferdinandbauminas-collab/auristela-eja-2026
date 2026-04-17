import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function generateReport() {
    console.log("--- Gerando Relatório Detalhado de Alunos por Turma ---");

    // Buscar todos os alunos e seus class_id
    const { data: students, error } = await supabase
        .from('ef_students')
        .select('name, class_id')
        .order('class_id', { ascending: true })
        .order('name', { ascending: true });

    if (error) {
        console.error("Erro ao buscar alunos:", error.message);
        return;
    }

    // Agrupar por class_id
    const report = {};
    students.forEach(s => {
        const cid = s.class_id || "SEM TURMA";
        if (!report[cid]) report[cid] = [];
        report[cid].push(s.name);
    });

    // Criar um arquivo de texto formatado para o usuário ler
    let output = "RELATÓRIO DE ALUNOS POR TURMA (9 TURMAS REAIS)\n";
    output += "===============================================\n\n";

    for (const [turma, lista] of Object.entries(report)) {
        output += `TURMA: ${turma} (${lista.length} alunos)\n`;
        output += "-----------------------------------------------\n";
        lista.forEach((name, index) => {
            output += `${(index + 1).toString().padStart(2, '0')}. ${name}\n`;
        });
        output += "\n";
    }

    const reportPath = 'RELATORIO_ALUNOS_2026.txt';
    fs.writeFileSync(reportPath, output);
    console.log(`Relatório gerado com sucesso: ${reportPath}`);
    console.log("Total de turmas com alunos:", Object.keys(report).filter(k => k !== "SEM TURMA").length);
}

generateReport();
