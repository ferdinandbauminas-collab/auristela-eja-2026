import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteDuplicates() {
    const idsToDelete = [
        '89616363-31a2-4be7-9c9c-614958e30386', // LÍNGUA ALTE IA
        '8ed2d8cb-c269-45f8-a374-a96597be6824'  // LÍNGUA MARK IA
    ];

    console.log(`Iniciando exclusão de ${idsToDelete.length} registros duplicados...`);

    for (const id of idsToDelete) {
        const { data, error } = await supabase
            .from('ef_classes')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error(`Erro ao deletar ID ${id}:`, error.message);
        } else {
            console.log(`Sucesso: Registro ${id} excluído.`);
            console.log(JSON.stringify(data, null, 2));
        }
    }
}

deleteDuplicates();
