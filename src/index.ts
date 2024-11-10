import express from 'express';
import './cron-jobs';
import { save_tariffs_to_sheets, tariffs_list } from './services/wb.service';
import dotenv from 'dotenv'
dotenv.config()

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.post('/api/upload_to_sheet', async (req, res) => {
    const { data, sheet_credentials } = req.body;

    if (!data || !data.length) {
        res.status(400).send({
            message: 'Field data is required in body'
        });

        return
    }

    try {
        const response = await save_tariffs_to_sheets(data, sheet_credentials);
        res.status(response.status).send(response.message);
    } catch (error) {
        console.error("Error uploading tariffs:", error);
        res.status(500).send({ error: "Failed to upload tariffs" });
    }
})

app.get('/api/tariff_list', async (req, res) => {
    const date = req.query.date as string | undefined;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if ( date && !dateRegex.test(date)) {
        res.status(400).send({
            message: 'Param date needs to be in format YYYY-MM-DD'
        });

        return
    }

    try {
        const response = await tariffs_list(date);
        res.status(200).send(response);
    } catch (error) {
        console.error("Error fetching tariffs:", error);
        res.status(500).send({ error: "Failed to fetch tariffs" });
    }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));