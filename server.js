const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// API-Endpunkt für die AI-Anfragen
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        // Nutzt das anmeldefreie DuckDuckGo AI Gateway
        const response = await fetch('https://duckduckgo.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini', // Kann kostenfrei & ohne Key genutzt werden
                messages: [{ role: 'user', content: userMessage }]
            })
        });

        // DuckDuckGo liefert einen Text-Stream (Server-Sent Events) zurück
        const text = await response.text();
        
        // Extrahiere den reinen Text aus dem Stream
        const lines = text.split('\n');
        let fullReply = '';
        for (let line of lines) {
            if (line.startsWith('data: ') && !line.includes('[DONE]')) {
                try {
                    const json = JSON.parse(line.slice(6));
                    if (json.message) fullReply += json.message;
                } catch(e) {}
            }
        }

        res.json({ reply: fullReply || "Entschuldigung, ich konnte keine Antwort generieren." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ reply: "Server-Fehler bei der AI-Verbindung." });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
