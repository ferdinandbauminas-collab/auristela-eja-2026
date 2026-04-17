-- FUNÇÃO PARA ATUALIZAR CONSOLIDADO AUTOMATICAMENTE
CREATE OR REPLACE FUNCTION fn_update_daily_consolidated()
RETURNS TRIGGER AS $$
BEGIN
    -- Recalcula o resumo para o aluno/dia/turma afetado
    INSERT INTO ef_daily_consolidated (date, student_name, class_name, presence_count, absence_count, is_absent_integral, gazeta_count)
    SELECT 
        date, 
        student_name, 
        class_name,
        COUNT(*) FILTER (WHERE status ILIKE '%present%') as presence_count,
        COUNT(*) FILTER (WHERE status ILIKE '%absent%') as absence_count,
        (COUNT(*) FILTER (WHERE status ILIKE '%present%') = 0 AND COUNT(*) FILTER (WHERE status ILIKE '%absent%') > 0) as is_absent_integral,
        CASE WHEN COUNT(*) FILTER (WHERE status ILIKE '%present%') > 0 THEN COUNT(*) FILTER (WHERE status ILIKE '%absent%') ELSE 0 END as gazeta_count
    FROM ef_attendance
    WHERE date = NEW.date AND student_name = NEW.student_name AND class_name = NEW.class_name
    GROUP BY date, student_name, class_name
    ON CONFLICT (date, student_name, class_name) 
    DO UPDATE SET 
        presence_count = EXCLUDED.presence_count,
        absence_count = EXCLUDED.absence_count,
        is_absent_integral = EXCLUDED.is_absent_integral,
        gazeta_count = EXCLUDED.gazeta_count,
        created_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER QUE DISPARA APÓS CADA LANÇAMENTO
DROP TRIGGER IF EXISTS trg_sync_attendance ON ef_attendance;
CREATE TRIGGER trg_sync_attendance
AFTER INSERT OR UPDATE OR DELETE ON ef_attendance
FOR EACH ROW EXECUTE FUNCTION fn_update_daily_consolidated();
