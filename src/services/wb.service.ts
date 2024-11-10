import axios from 'axios';
import dotenv from 'dotenv'
import { tariffDto } from '../dto/tariff.dto';
import { get_tariffs, insert_tariffs } from '../repositories/tariff-repository'
import { export_sheets } from './google-sheets.service'
import { sheetDto } from '../dto';

dotenv.config()

export async function fetch_tariffs() {
    const date = new Date().toISOString().split('T')[0]
    const response = await axios.get('https://common-api.wildberries.ru/api/v1/tariffs/box', {
        headers: {
            'Authorization': String(process.env.WB_TOKEN)
        },
        params: {
            date: date,
        }
    });

    return response.data.response.data.warehouseList;
}

export async function save_tariffs_to_db() {
    const tariffs: tariffDto[] = await fetch_tariffs()

    if (tariffs.length < 1) {
        return
    }
    
    const preparedData = tariffs.map(tariff => ({
        ...tariff,
        date: new Date().toISOString().split('T')[0]
    }));

    let response
    try {
        response = await insert_tariffs(preparedData)
    } catch (error) {
        console.error('Error insert data:', error);
    }

    return response
  }

export async function save_tariffs_to_sheets(data: tariffDto[], sheet_credentials: sheetDto[] = []) {
    if (!sheet_credentials || sheet_credentials.length < 1) {
        const sheetId: string = String(process.env.GOOGLE_SHEET_ID)
        const sheetName = String(process.env.GOOGLE_SHEET_NAME)
        
        sheet_credentials.push({
            id: sheetId,
            name: `${sheetName}!A2`
        })
    }

    try {
        await export_sheets(sheet_credentials, data)
    } catch (error) {
        console.error('Error insert data:', error);
        
        return {
            status: 400,
            message: 'Invalid data to upload'
        }
    }

    return {
        status: 200,
        message: 'Tariffs uploaded to sheet'
    }
}

export async function tariffs_list(date?: string) {
    const data = await get_tariffs(date)

    return data
}