import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const prosConsDiscussesUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
          Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
          la respuesta debe de ser en formato markdown bien estructurada
          evitando saltos de lineas innecesarios y manteniendo un formato claro y ordenado,
          los pros y contras deben de estar en una lista,

          Ejemplo de salida:

          **Objeto 1:**
          **Pros:**
          1. Pro 1
          2. Pro 2
          3. Pro 3
          **Contras:**
          1. Contra 1
          2. Contra 2
          3. Contra 3
          ---
          **Objeto 2:**
          **Pros:**
          1. Pro 1
          2. Pro 2
          3. Pro 3
          **Contras:**
          1. Contra 1
          2. Contra 2
          3. Contra 3
          ---
          **Consejo:**
          Explicar en qué situaciones es mejor usar cada objeto.
          `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'gpt-4',
    //! temperature property is not available in gpt-4
    //! response_format properties are only available in gpt-3.5-turbo
    temperature: 0.8,
    max_completion_tokens: 500,
    // response_format: {
    //   type: 'json_object',
    // },
  });

  return completion.choices[0].message;
};
