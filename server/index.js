import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 5050; // পোর্ট পরিবর্তন করা হয়েছে

const TELEGRAM_BOT_TOKEN = '8140462013:AAHILsAM_AjY4kxqTW4FJu9b2RNlKf1fBvs';
const TELEGRAM_CHAT_ID = '7429947930';

// ESM-এ __dirname তৈরি করা
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/send-message', async (req, res) => {
  try {
    const { name, message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).send('Message is required');
    }

    const userName = name && name.trim() !== '' ? name.trim() : 'Anonymous';

    const telegramMessage = `New message from personal website:\n\nName: ${userName}\nMessage: ${message.trim()}`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('Telegram API Error:', data);
      return res.status(500).send('Failed to send message to Telegram.');
    }

    console.log('Message sent successfully to Telegram!');
    res.redirect('/');
  } catch (error) {
    console.error('Error while sending Telegram message:', error);
    res.status(500).send('Internal Server Error');
  }
});

// ✅ /info রাউট যুক্ত করা হলো
app.get('/info', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'info.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
