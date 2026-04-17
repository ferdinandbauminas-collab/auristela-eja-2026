import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fixWrongDates() {
    // 1. Identificar registros com date = '2026-03-13' criados antes das 18h de hoje
    // (Aulas de EJA são à noite, portanto lançamentos antes das 18h pertencem ao dia anterior)
    const { data: wrongData, error: err1 } = await supabase
        .from('ef_attendance')
        .select('id, created_at, teacher_name')
        .eq('date', '2026-03-13')
        .lt('created_at', '2026-03-13T21:00:00Z'); // 21:00 UTC = 18:00 BRT

    if (err1) {
        console.error("Erro ao buscar dados errados:", err1);
        return;
    }

    console.log(`Encontrados ${wrongData.length} registros com data errada (13/03 ao invés de 12/03).`);
    
    if (wrongData.length === 0) {
        console.log("Nenhum ajuste necessário.");
        return;
    }

    const idsToUpdate = wrongData.map(d => d.id);

    // 2. Atualizar para a data correta
    const { error: errUpdate } = await supabase
        .from('ef_attendance')
        .update({ date: '2026-03-12' })
        .in('id', idsToUpdate);

    if (errUpdate) {
        console.error("Erro ao corrigir datas:", errUpdate);
        return;
    }

    console.log("Datas corrigidas na tabela ef_attendance com sucesso!");

    // IMPORTANTE: Como alteramos a data, o Trigger apenas atualizou o consolidado de '2026-03-12'.
    // Os consolidados velhos de '2026-03-13' ficaram no banco com totais errados. 
    // Vamos processar uma "limpeza" do 13/03 consolidado que ficou zerado/inválido.
    
    // Como ainda não houve aula no dia 13, podemos apenas deletar os resumos do dia 13.
    const { error: errCleanup } = await supabase
        .from('ef_daily_consolidated')
        .delete()
        .eq('date', '2026-03-13');

    if (errCleanup) {
        console.log("Aviso ao limpar consolidado do dia 13:", errCleanup);
    } else {
        console.log("Consolidados residuais do dia 13 limpos!");
    }
}

fixWrongDates();
