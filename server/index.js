import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

const TELEGRAM_BOT_TOKEN = '8140462013:AAHILsAM_AjY4kxqTW4FJu9b2RNlKf1fBvs';
const TELEGRAM_CHAT_ID = '7429947930';

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
      return res.status(500).send('Failed to send message to Telegram.');
    }

    res.redirect('/'); // অথবা success পেজে যেতে পারো
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
