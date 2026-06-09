import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
    console.log('=== ATUALIZANDO BANCO DE DADOS - ATRIBUIÇÕES DO PROFESSOR DENILSON ===');

    // 1. Atualizar ELETIVA ORIENTADA (MÓDULO INFO IIIA) (ID: 1a498f48-27db-42d6-8334-ff2519f7ca9d) para SALOMÃO
    console.log('\n1. Atualizando Eletiva Orientada IIIA para o Professor Salomão...');
    const { error: err1 } = await supabase
        .from('ef_classes')
        .update({ teacher_id: 'salomao' })
        .eq('id', '1a498f48-27db-42d6-8334-ff2519f7ca9d');
        
    if (err1) {
        console.error('Erro na atualização 1:', err1.message);
    } else {
        console.log('Sucesso: Eletiva IIIA atribuída a Salomão.');
    }

    // 2. Deletar as duplicatas e placeholders da tabela ef_classes
    const idsToDelete = [
        '3245c7a3-f5fd-4179-bf1d-ba058ebaa5f7', // Eletiva IIIB (Denilson duplicado)
        '679cc750-1569-423a-aa82-3eeaf93a6cd9', // Programacao IIIA (Denilson duplicado)
        '4172c65b-02fe-47fb-a015-fad9175fb23b', // Rede IIIA (Denilson duplicado)
        'aef8e165-97f9-4de5-a735-1567bcbcb8b4', // Banco IA (Denilson placeholder)
        'ecda05f1-6ee1-471c-99de-bc3cbd89742d', // Programacao IA (Denilson placeholder)
        '16b4f6bb-685d-4a17-94b7-91140eb9e55d', // Rede IA (Denilson placeholder)
        '584b1ed2-4271-436c-8263-27f2852fca26', // InfoAplicada IIIA (Denilson placeholder)
        'a5c60933-0fab-4aa3-887c-12bcbd5577bc'  // InfoAplicada IIIB (Denilson placeholder)
    ];

    console.log('\n2. Deletando duplicatas e placeholders de Denilson...');
    const { error: err2 } = await supabase
        .from('ef_classes')
        .delete()
        .in('id', idsToDelete);
        
    if (err2) {
        console.error('Erro ao deletar registros:', err2.message);
    } else {
        console.log(`Sucesso: ${idsToDelete.length} registros duplicados/placeholders deletados.`);
    }

    console.log('\n=== VERIFICANDO ATRIBUIÇÕES FINAIS DE DENILSON NO BANCO ===');
    const { data: finalClasses } = await supabase
        .from('ef_classes')
        .select('*')
        .eq('teacher_id', '015a3da3-4abe-409b-ba98-25386247fc39');
        
    console.log(`Denilson possui agora ${finalClasses.length} disciplinas no banco:`);
    finalClasses.forEach(c => {
        console.log(`- ${c.name} (${c.grade}) [ID: ${c.id}]`);
    });
}

run();
