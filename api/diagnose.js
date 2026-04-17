export default async function handler(req, res) {

  const { plant } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + process.env.OPENAI_API_KEY
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Tu es un expert jardinier pour personnes en situation de handicap. Réponds avec 3 conseils simples."
        },
        {
          role: "user",
          content: "Plante: " + plant
        }
      ],
      temperature: 0.3
    })
  });

  const data = await response.json();

  res.status(200).json({
    text: data.choices[0].message.content
  });
}
