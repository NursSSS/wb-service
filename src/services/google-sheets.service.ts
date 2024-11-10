import { google } from 'googleapis';
import { sheetDto, tariffDto } from '../dto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const file = path.join(__dirname, '../../google_file.json');

export async function export_sheets(sheet_credentials: sheetDto[], tariffs: tariffDto[]) {
    const auth = new google.auth.GoogleAuth({
        keyFile: file,
        scopes: "https://www.googleapis.com/auth/spreadsheets",
      });
    const sheets = google.sheets({ version: 'v4', auth });

    const sortedData = tariffs.sort((a, b) => parseFloat(a.boxDeliveryAndStorageExpr) - parseFloat(b.boxDeliveryAndStorageExpr));
    const preparedData = sortedData.map((item: tariffDto) => [
        item.warehouseName,
        item.boxDeliveryAndStorageExpr,
        item.boxDeliveryBase,
        item.boxDeliveryLiter,
        item.boxStorageBase,
        item.boxStorageLiter,
    ]);

    for (let i = 0; i < sheet_credentials.length; i++) {
        const data = {
            spreadsheetId: sheet_credentials[i].id,
            valueInputOption: "USER_ENTERED",
            resource: {
                values: preparedData,
            },
            range: `${sheet_credentials[i].name}`,
        };
        
        await sheets.spreadsheets.values.update(data);
    }

    return
}