import cron from 'node-cron';
import { save_tariffs_to_db } from './services/wb.service';

cron.schedule('0 * * * *', async () => {
    await save_tariffs_to_db()
    console.log('Google sheet updated')
    return
});