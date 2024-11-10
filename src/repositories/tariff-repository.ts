import db from '../database/db';
import { tariffDto } from '../dto/tariff.dto';

export async function insert_tariffs(tariffs: tariffDto[]) {
    return await db('tariffs')
        .insert(tariffs)
        .onConflict(['warehouseName', 'date'])
        .merge();
}

export async function get_tariffs(date?: string) {
    if (date) {        
        return await db('tariffs')
            .where('date', date)
            .select('*');
    } else {
        return await db('tariffs').select('*');
    }
}