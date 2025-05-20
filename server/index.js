import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // .env থেকে ভ্যারিয়েবল লোড

const app = express();
const PORT = 5050;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

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

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
