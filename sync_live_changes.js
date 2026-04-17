import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Erro: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não encontradas no .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function sync() {
    console.log("🚀 Iniciando atualização no Supabase (Live)...");

    // 1. Atualizar ef_classes
    // O filtro grade='MÓDULO INFO VD' é o padrão nos backups
    console.log("--- Atualizando ef_classes...");
    const { data: classUpdate, error: classError } = await supabase
        .from('ef_classes')
        .update({ teacher_id: null })
        .eq('name', 'ELETIVA ORIENTADA')
        .eq('grade', 'MÓDULO INFO VD');

    if (classError) {
        console.error("⚠️ Erro em ef_classes:", classError.message);
    } else {
        console.log("✅ ef_classes atualizada com sucesso.");
    }

    // 2. Atualizar ef_schedule
    // Cobrimos variações de nome da turma e da disciplina
    console.log("--- Atualizando ef_schedule...");
    const { data: schedUpdate, error: schedError } = await supabase
        .from('ef_schedule')
        .update({ teacher_name: 'SEM PROFESSOR' })
        .eq('teacher_name', 'GERSON DOS SANTOS')
        .or('class_group.ilike.%MOD V%,class_group.ilike.%INFO V%');

    if (schedError) {
        console.error("⚠️ Erro em ef_schedule:", schedError.message);
    } else {
        console.log("✅ ef_schedule atualizada com sucesso.");
    }

    console.log("🚀 Sincronização concluída! O aplicativo deve refletir as mudanças agora.");
}

sync();
