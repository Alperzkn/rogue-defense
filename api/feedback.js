export const config = {
  api: { bodyParser: { sizeLimit: '5mb' } },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, message, contact, image } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const caption = [
    `*New ${type || 'Feedback'}*`,
    '',
    message.trim(),
    '',
    contact ? `Contact: ${contact}` : '_No contact provided_',
  ].join('\n');

  const botUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  try {
    // If image is attached, send as photo with caption
    if (image) {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const ext = image.match(/^data:image\/(\w+);/)?.[1] || 'png';

      const formData = new FormData();
      formData.append('chat_id', chatId);
      formData.append('caption', caption);
      formData.append('parse_mode', 'Markdown');
      formData.append('photo', new Blob([buffer], { type: `image/${ext}` }), `screenshot.${ext}`);

      const resp = await fetch(`${botUrl}/sendPhoto`, {
        method: 'POST',
        body: formData,
      });

      if (!resp.ok) {
        // Fallback: send text only if photo fails
        await fetch(`${botUrl}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: caption + '\n\n_⚠️ Image failed to attach_', parse_mode: 'Markdown' }),
        });
      }
    } else {
      const resp = await fetch(`${botUrl}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: caption, parse_mode: 'Markdown' }),
      });

      if (!resp.ok) {
        return res.status(500).json({ error: 'Failed to send message' });
      }
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
