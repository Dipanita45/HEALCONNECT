export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const { text } = req.body || {};
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Missing text' });
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        const r = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content:
                  'Rewrite the given prescription into a single, plain-English instruction for a patient. Use simple words, specify when to take it, how often, and for how long. Keep it under 30 words and exclude warnings.',
              },
              { role: 'user', content: text },
            ],
            temperature: 0.2,
            max_tokens: 80,
          }),
        });
        if (!r.ok) {
          const t = await r.text().catch(() => '');
          throw new Error(`Upstream ${r.status} ${t}`);
        }
        const j = await r.json();
        const c =
          j?.choices?.[0]?.message?.content?.trim() ||
          j?.choices?.[0]?.text?.trim() ||
          '';
        if (c) {
          return res.status(200).json({ summary: c });
        }
      } catch (e) {}
    }
    const fallback = simpleRewrite(text);
    return res.status(200).json({ summary: fallback });
  } catch (e) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

function simpleRewrite(t) {
  const m = extractField(t, 'Medicine');
  const d = extractField(t, 'Dosage');
  const f = extractField(t, 'Frequency');
  const u = extractField(t, 'Duration');
  const n = extractField(t, 'Notes');
  const parts = [];
  if (m) parts.push(`Take ${m}`);
  if (d) parts.push(`${d}`);
  if (f) parts.push(`${f.toLowerCase()}`);
  if (u) parts.push(`for ${u}`);
  let s = parts.join(', ');
  if (s && !s.endsWith('.')) s += '.';
  if (n) s += ` ${n}.`;
  return s || 'Take as directed, as shown on your prescription.';
}

function extractField(t, label) {
  const r = new RegExp(`${label}\\s*:\\s*([^\\n]+)`, 'i');
  const m = t.match(r);
  return m ? m[1].trim() : '';
}

