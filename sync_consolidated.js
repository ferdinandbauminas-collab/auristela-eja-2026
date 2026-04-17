import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function syncConsolidated() {
    console.log("--- Iniciando Sincronização de Dados Consolidados ---");
    const DATA_CORTE = '2026-03-02';

    // 1. Buscar todos os registros de frequência usando paginação
    let allAttendance = [];
    const PAGE_SIZE = 1000;
    let from = 0;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from('ef_attendance')
            .select('*')
            .gte('date', DATA_CORTE)
            .range(from, from + PAGE_SIZE - 1);

        if (error) {
            console.error("Erro ao buscar frequências:", error);
            return;
        }

        allAttendance = allAttendance.concat(data);
        console.log(`Lote carregado: ${allAttendance.length} registros...`);
        
        if (data.length < PAGE_SIZE) {
            hasMore = false;
        } else {
            from += PAGE_SIZE;
        }
    }

    console.log(`Total carregado: ${allAttendance.length} registros.`);

    // 2. Agrupar por dia e aluno
    const dailyMap = {};

    allAttendance.forEach(record => {
        const key = `${record.date}|${record.student_name}|${record.class_name}`;
        if (!dailyMap[key]) {
            dailyMap[key] = {
                date: record.date,
                student_name: record.student_name,
                class_name: record.class_name,
                pres: 0,
                abs: 0
            };
        }
        if (record.status.toLowerCase().includes('present')) {
            dailyMap[key].pres++;
        } else {
            dailyMap[key].abs++;
        }
    });

    // 3. Preparar dados para inserção
    const consolidated = Object.values(dailyMap).map(d => {
        const isAbsentIntegral = d.pres === 0 && d.abs > 0;
        const gazetaCount = (d.pres > 0 && d.abs > 0) ? d.abs : 0;
        
        return {
            date: d.date,
            student_name: d.student_name,
            class_name: d.class_name,
            presence_count: d.pres,
            absence_count: d.abs,
            is_absent_integral: isAbsentIntegral,
            gazeta_count: gazetaCount
        };
    });

    console.log(`Consolidando ${consolidated.length} linhas diárias...`);

    // 4. Inserir no banco (usando upsert para evitar duplicidade)
    const { error: insError } = await supabase
        .from('ef_daily_consolidated')
        .upsert(consolidated, { onConflict: 'date, student_name, class_name' });

    if (insError) {
        console.error("Erro ao inserir consolidados:", insError.message);
        if (insError.message.includes('relation "ef_daily_consolidated" does not exist')) {
            console.log("AVISO: A tabela ef_daily_consolidated ainda não existe no Supabase.");
        }
    } else {
        console.log("✅ Sincronização concluída com sucesso!");
    }
}

syncConsolidated();
