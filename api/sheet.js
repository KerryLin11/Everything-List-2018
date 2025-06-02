// api/sheets.js

export default async function handler(request, response) {
    const apiKey = process.env.GSHEETS_API_KEY;
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const range = 'Master List!A:E'; // Or pass this as a query param if you want flexibility

    if (!apiKey || !spreadsheetId) {
        response.status(500).json({ error: 'Missing environment variables' });
        return;
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;

    try {
        const fetchResponse = await fetch(url);
        if (!fetchResponse.ok) {
            throw new Error('Failed to fetch data from Google Sheets');
        }
        const data = await fetchResponse.json();
        response.status(200).json(data);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
}
