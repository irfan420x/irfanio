import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// Telegram Bot Token এবং Chat ID (তোমার নিজস্ব Telegram username দিয়ে chat_id দরকার, সেটা আমি ধরলাম তুমি সেটাপ করেছ)
const TELEGRAM_BOT_TOKEN = '8140462013:AAHILsAM_AjY4kxqTW4FJu9b2RNlKf1fBvs';
const TELEGRAM_CHAT_ID = '@Irfan420x'; // অথবা তোমার chat ID (নম্বর) দিয়ে

// Path fix for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Route - হোমপেজ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Route - ফর্ম সাবমিট
app.post('/send-message', async (req, res) => {
  const { name, favorite, message } = req.body;

  // টেলিগ্রামে পাঠানোর মেসেজ ফরম্যাট
  const text = `
New message from personal website:

Name: ${name || 'Anonymous'}
Favorite: ${favorite}
Message: ${message}
  `;

  // Telegram API URL
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    // Send message to Telegram
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();

    if (data.ok) {
      // সফল হলে ধন্যবাদ পেজ বা হোমপেজে redirect করো
      res.send(`<h2>Thank you for your message!</h2><p><a href="/">Back to home</a></p>`);
    } else {
      res.status(500).send('Failed to send message to Telegram.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending message.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
