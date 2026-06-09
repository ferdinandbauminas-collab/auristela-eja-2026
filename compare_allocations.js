import { createClient } from '@supabase/supabase-js';
import { teacherAllocations } from '../GestaoNotas/src/lib/teacherAllocations.js';

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function normalize(str) {
    if (!str) return "";
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/\s+/g, " ").trim();
}

function normalizeDiscipline(str) {
    let d = normalize(str);
    d = d.replace("REDES DE COMPUTADORES", "REDE DE COMPUTADORES");
    d = d.replace("ELETIVAS", "ELETIVA");
    d = d.replace("ELETIVA ORIENTADA", "ELETIVA");
    return d;
}

// Mapeamento de turmas para o formato do banco
function mapGradeToDB(grade) {
    let g = normalize(grade);
    g = g.replace("MOD ", "MÓDULO INFO ");
    g = g.replace("MÓDULO INFO I A ALT", "MÓDULO ALTE IA");
    g = g.replace("MÓDULO INFO I A MARK", "MÓDULO MARK IA");
    g = g.replace("MÓDULO INFO I A", "MÓDULO INFO IA");
    g = g.replace("MÓDULO INFO III A", "MÓDULO INFO IIIA");
    g = g.replace("MÓDULO INFO III B", "MÓDULO INFO IIIB");
    g = g.replace("MÓDULO INFO V A", "MÓDULO INFO VA");
    g = g.replace("MÓDULO INFO V B", "MÓDULO INFO VB");
    g = g.replace("MÓDULO INFO V C", "MÓDULO INFO VC");
    g = g.replace("MÓDULO INFO V D", "MÓDULO INFO VD");
    return g;
}

async function check() {
    const { data: teachers, error: tErr } = await supabase.from('ef_teachers').select('*');
    const { data: classes, error: cErr } = await supabase.from('ef_classes').select('*');
    
    if (tErr || cErr) {
        console.error(tErr || cErr);
        return;
    }
    
    // Encontrar Denilson
    const denilsonDB = teachers.find(t => normalize(t.name) === 'DENILSON');
    console.log('Denilson no Banco:', denilsonDB);
    
    const denilsonClassesDB = classes.filter(c => c.teacher_id === denilsonDB.id);
    console.log(`\n=== DISCIPLINAS DE DENILSON NO BANCO DE DADOS (${denilsonClassesDB.length}) ===`);
    denilsonClassesDB.forEach(c => {
        console.log(`- ${c.name} (${c.grade})`);
    });
    
    // Denilson no teacherAllocations.js
    const denilsonAlloc = teacherAllocations.find(t => t.professor.includes('DENILSON'));
    console.log(`\n=== DISCIPLINAS DE DENILSON NO teacherAllocations.js (${denilsonAlloc.disciplinas.length}) ===`);
    denilsonAlloc.disciplinas.forEach(d => {
        console.log(`- ${d.disciplina} (${d.turma})`);
    });
    
    // Cruzamento e comparação
    console.log('\n=== COMPARAÇÃO DE DADOS PARA O PROFESSOR DENILSON ===');
    
    // 1. O que está no teacherAllocations.js mas NÃO está no Banco de Dados (para o Denilson)
    console.log('\n--- 1. Analisando alocações do arquivo teacherAllocations.js no Banco de Dados ---');
    denilsonAlloc.disciplinas.forEach(d => {
        const dbGrade = mapGradeToDB(d.turma);
        const normDisc = normalizeDiscipline(d.disciplina);
        
        const matchInDB = denilsonClassesDB.find(c => normalizeDiscipline(c.name) === normDisc && normalize(c.grade) === normalize(dbGrade));
        
        if (matchInDB) {
            console.log(`[OK] Mapeamento correto: "${d.disciplina}" na turma "${d.turma}" (Banco: "${matchInDB.name}" em "${matchInDB.grade}")`);
        } else {
            // Procurar se a disciplina/turma está no banco mas atribuída a outro professor
            const anyMatch = classes.find(c => normalizeDiscipline(c.name) === normDisc && normalize(c.grade) === normalize(dbGrade));
            if (anyMatch) {
                const owner = teachers.find(t => t.id === anyMatch.teacher_id);
                console.log(`[DIVERGÊNCIA] "${d.disciplina}" na turma "${d.turma}" está no banco, mas associada a: ${owner ? owner.name : 'Ninguém (ID: ' + anyMatch.teacher_id + ')'}`);
            } else {
                console.log(`[NÃO EXISTE NO DB] "${d.disciplina}" na turma "${d.turma}" não foi encontrada no banco.`);
            }
        }
    });

    // 2. O que está no Banco de Dados associado ao Denilson, mas NÃO está no teacherAllocations.js
    console.log('\n--- 2. Classes no Banco de Dados com Denilson que NÃO estão no teacherAllocations.js ---');
    denilsonClassesDB.forEach(c => {
        const normName = normalizeDiscipline(c.name);
        const normGrade = normalize(c.grade);
        
        const matchInAlloc = denilsonAlloc.disciplinas.find(d => {
            const dbGrade = mapGradeToDB(d.turma);
            return normalizeDiscipline(d.disciplina) === normName && normalize(dbGrade) === normGrade;
        });
        
        if (!matchInAlloc) {
            console.log(`- ${c.name} (${c.grade})`);
        }
    });
}

check();
