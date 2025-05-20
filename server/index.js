const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your real Telegram bot token and chat ID
const TELEGRAM_BOT_TOKEN = '8140462013:AAHILsAM_AjY4kxqTW4FJu9b2RNlKf1fBvs';
const TELEGRAM_CHAT_ID = '@Irfan420x';

app.use(cors());
app.use(bodyParser.json());

app.post('/send', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, error: 'Message is required' });
  }

  const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: `New Anonymous Message:\n\n${message}`
      })
    });

    const data = await response.json();

    if (!data.ok) {
      throw new Error(data.description || 'Failed to send Telegram message');
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Telegram error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
