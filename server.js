const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        // Nutzt die offizielle, schlüssellose Text-API von Pollinations AI
        const response = await fetch('https://text.pollinations.ai/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [{ role: "user", content: userMessage }],
                model: "openai" // Nutzt standardmäßig ein schnelles, freies Textmodell
            })
        });

        if (!response.ok) {
            throw new Error(`API Fehler mit Status: ${response.status}`);
        }

        // Pollinations liefert direkt die reine Textantwort zurück
        const replyText = await response.text();
        res.json({ reply: replyText || "Keine Antwort erhalten." });

    } catch (error) {
        console.error("API Fehler:", error);
        res.status(500).json({ reply: "Die freie AI-Schnittstelle ist ausgelastet. Bitte versuche es gleich noch einmal." });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
