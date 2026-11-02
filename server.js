const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        // Nutzt ein offenes, schlüsselloses KI-Schnittstellen-Netzwerk
        const response = await fetch('https://chateverywhere.app', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://chateverywhere.app'
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: userMessage }]
            })
        });

        const data = await response.text();
        res.json({ reply: data || "Keine Antwort erhalten." });

    } catch (error) {
        console.error("API Fehler:", error);
        res.status(500).json({ reply: "Die freie AI-Schnittstelle antwortet gerade nicht. Bitte versuche es gleich noch einmal." });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
