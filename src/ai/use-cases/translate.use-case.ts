import OpenAI from 'openai';

interface Options {
  prompt: string;
  lang: string;
}

export const translateUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, lang } = options;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
          Traduce el siguiente texto al idioma ${lang}: ${prompt}
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
    temperature: 0.3,
    // response_format: {
    //   type: 'json_object',
    // },
  });

  return completion.choices[0].message;
};
