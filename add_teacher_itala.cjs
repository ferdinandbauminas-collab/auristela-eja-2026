const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://wkmjoeoankucnhhanbqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWpvZW9hbmt1Y25oaGFuYnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA2OTMsImV4cCI6MjA4NjY0NjY5M30.lCcKfDP-Zv56VtXxXtdaNjspO8FidkqIryd0ssdQYsM';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function addTeacher() {
    console.log('--- Inserindo Professora: ITALA RODRIGUES PROBO ---');
    
    const newTeacher = {
        name: 'ITALA RODRIGUES PROBO',
        subject: 'PROJETO DE APRENDIZAGEM INTERDISCIPLINAR, ELETIVA E REDAÇÃO PARA O MARKETING DIGITAL',
        avatar: null
    };

    const { data, error } = await supabase
        .from('ef_teachers')
        .insert([newTeacher])
        .select();

    if (error) {
        console.error('Erro ao inserir professor:', error);
    } else {
        console.log('Professor(a) inserido(a) com sucesso!');
        console.log('Dados:', data[0]);
    }
}

addTeacher();
