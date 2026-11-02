const express = require('express');
const path = require('path');
const { DuckChat } = require('duckduckgo-chat-interface');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ reply: "Leere Nachricht empfangen." });
        }

        const chat = new DuckChat();
        await chat.initialize();
        const response = await chat.fetchFull(userMessage);

        res.json({ reply: response });
    } catch (error) {
        console.error("Fehler im AI-Backend:", error);
        res.status(500).json({ 
            reply: "Der AI-Dienst ist ausgelastet oder blockiert die Anfrage momentan. Bitte versuche es in wenigen Sekunden noch einmal." 
        });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
