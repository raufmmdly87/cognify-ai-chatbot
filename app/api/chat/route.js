export async function POST(request) {
  const { messages } = await request.json();

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: 'Missing OPENROUTER_API_KEY in .env' },
      { status: 500 },
    );
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'nvidia/nemotron-3-super-120b-a12b:free',
      messages: messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    return Response.json(
      { error: `OpenRouter error: ${errorText}` },
      { status: 500 },
    );
  }

  const data = await response.json();

  return Response.json({
    content: data.choices?.[0]?.message?.content || 'No response received.',
  });
}