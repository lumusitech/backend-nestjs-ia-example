import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export interface OrthographyResponse {
  userScore: number;
  errors: string[];
  message: string;
}

export const orthographyCheckUseCase = async (
  openai: OpenAI,
  options: Options,
): Promise<OrthographyResponse> => {
  const { prompt } = options;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
          Te serán proveídos textos en español con posibles errores ortográficos y gramaticales (no olvides revisar las tildes en cada palabra que la requiera).
          Las palabras usadas deben de existir en el diccionario de la Real Academia Española.
          Debes de responder en formato JSON, tu tarea es corregirlos y retornar información de las solicitudes, 
          también debes enviar un porcentaje de acierto por el usuario. 
          Si no hay errores, o son pocos debes de retornar una mensaje de felicitaciones

          Ejemplo de salida:
          {
            userScore: number,
            errors: string[] // ['error -> solución', 'error -> solución'],
            message: string // usa emojis y texto para felicitar al usuario
          }
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

  const jsonResp = JSON.parse(
    completion.choices[0].message.content ?? '{}',
  ) as OrthographyResponse;

  return jsonResp;
};
