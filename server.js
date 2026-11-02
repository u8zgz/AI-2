const express = require('express');
const path = require('path');
// Wichtig: Wir importieren das funktionierende DuckDuckGo-Interface
const { DuckChat } = require('duckduckgo-chat-interface');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// API-Endpunkt für die AI-Anfragen
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        // Erstellt eine frische, anonyme Session bei DuckDuckGo
        const chat = new DuckChat();
        await chat.initialize();

        // Holt die Antwort (Standardmodell ist hier ein schnelles gpt-4o-mini)
        const response = await chat.fetchFull(userMessage);

        res.json({ reply: response });
    } catch (error) {
        console.error("Fehler beim AI-Aufruf:", error);
        res.status(500).json({ reply: "Verbindung zum AI-Dienst fehlgeschlagen. Bitte versuche es noch einmal." });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
