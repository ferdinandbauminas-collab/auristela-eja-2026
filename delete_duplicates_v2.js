import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteDuplicates() {
    const idsToDelete = [
        '89616363-31a2-4be7-9c9c-614958e30386',
        '8ed2d8cb-c269-45f8-a374-a96597be6824'
    ];

    console.log(`Tentando deletar ${idsToDelete.length} registros...`);

    for (const id of idsToDelete) {
        // Try deleting and check if rows are actually returned
        const { data, count, error } = await supabase
            .from('ef_classes')
            .delete({ count: 'exact' })
            .eq('id', id)
            .select();

        if (error) {
            console.error(`Erro ao deletar ID ${id}:`, error.message);
        } else {
            console.log(`Resultado para ID ${id}:`);
            console.log(`- Registros retornados pela query: ${data.length}`);
            console.log(`- Count exato: ${count}`);
            if (data.length === 0) {
                console.warn(`AVISO: O registro com ID ${id} não foi deletado. Isso geralmente ocorre devido a políticas de RLS ou permissões insuficientes da chave VITE_SUPABASE_ANON_KEY.`);
            }
        }
    }
}

deleteDuplicates();
