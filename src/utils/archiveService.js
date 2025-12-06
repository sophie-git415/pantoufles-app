import { supabase } from '../supabaseClient';

/**
 * Archive toutes les missions complétées d'un mois donné
 * @param {number} year - Année (ex: 2025)
 * @param {number} month - Mois (ex: 12 pour décembre)
 * @returns {object} - {success: bool, archivedCount: int, message: string}
 */
export const archiveMissionsOfMonth = async (year, month) => {
    try {
        // Début et fin du mois
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const endDate = new Date(year, month, 0).toISOString().split('T')[0];

        // 1. Récupérer toutes les missions complétées du mois
        const { data: missionsToArchive, error: fetchError } = await supabase
            .from('missions')
            .select('*')
            .eq('status', 'terminée')
            .gte('date_mission', startDate)
            .lte('date_mission', endDate);

        if (fetchError) throw fetchError;

        if (!missionsToArchive || missionsToArchive.length === 0) {
            return {
                success: true,
                archivedCount: 0,
                message: `Aucune mission complétée à archiver pour ${month}/${year}`,
            };
        }

        // 2. Insérer ou mettre à jour dans missions_archived (upsert)
        const { error: insertError } = await supabase
            .from('missions_archived')
            .upsert(missionsToArchive, { onConflict: 'id' });

        if (insertError) throw insertError;

        // 3. Supprimer de missions (Option B - pas de doublon)
        const missionIds = missionsToArchive.map(m => m.id);
        const { error: deleteError } = await supabase
            .from('missions')
            .delete()
            .in('id', missionIds);

        if (deleteError) throw deleteError;

        return {
            success: true,
            archivedCount: missionsToArchive.length,
            message: `✅ ${missionsToArchive.length} mission(s) archivée(s) pour ${month}/${year}`,
        };
    } catch (error) {
        console.error('Erreur archivage :', error);
        return {
            success: false,
            archivedCount: 0,
            message: `❌ Erreur : ${error.message}`,
        };
    }
};

/**
 * Récupère les missions archivées avec filtres
 * @param {object} filters - {year, month, client_id, intervenant_id}
 * @returns {array} - Missions archivées
 */
export const getArchivedMissions = async (filters = {}) => {
    try {
        let query = supabase.from('missions_archived').select('*');

        if (filters.year && filters.month) {
            const startDate = `${filters.year}-${String(filters.month).padStart(2, '0')}-01`;
            const endDate = new Date(filters.year, filters.month, 0).toISOString().split('T')[0];
            query = query.gte('date_mission', startDate).lte('date_mission', endDate);
        }

        if (filters.client_id) {
            query = query.eq('client_id', filters.client_id);
        }

        if (filters.intervenant_id) {
            query = query.eq('intervenant_id', filters.intervenant_id);
        }

        const { data, error } = await query.order('date_mission', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Erreur récupération missions archivées :', error);
        return [];
    }
};