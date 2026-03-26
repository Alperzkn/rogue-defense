export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, message, contact } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const text = [
    `*New ${type || 'Feedback'}*`,
    '',
    message.trim(),
    '',
    contact ? `Contact: ${contact}` : '_No contact provided_',
  ].join('\n');

  try {
    const resp = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'Markdown',
        }),
      }
    );

    if (!resp.ok) {
      return res.status(500).json({ error: 'Failed to send message' });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
