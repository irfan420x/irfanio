const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const TELEGRAM_BOT_TOKEN = '8140462013:AAHILsAM_AjY4kxqTW4FJu9b2RNlKf1fBvs';
const TELEGRAM_CHAT_ID = '7429947930';  // তোমার TG Chat ID

app.post('/send-message', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).send('Message is required');
  }

  const text = `
New message from @Irfan420x:

${message}
  `;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: 'Markdown',
    });
    res.send('Message sent successfully!');
  } catch (error) {
    console.error('Telegram send error:', error.response?.data || error.message);
    res.status(500).send('Failed to send message to Telegram.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
