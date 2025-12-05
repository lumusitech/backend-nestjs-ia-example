import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const prosConsDiscussesStreamUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  return await openai.chat.completions.create({
    stream: true,
    messages: [
      {
        role: 'system',
        content: `
          Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
          la respuesta debe de ser en formato markdown,
          los pros y contras deben de estar en una lista,
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
};
