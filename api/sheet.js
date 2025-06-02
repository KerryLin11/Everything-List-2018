import { config } from 'dotenv';
config();

export default async function handler(req, res) {
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const { range } = req.query;

    if (!range) {
        return res.status(400).json({ error: 'Missing range parameter' });
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Google Sheets API error: ${response.statusText}`);
        }
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);
        res.status(500).json({ error: 'Failed to fetch data from Google Sheets' });
    }
}
