import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import { PDFParse } from 'pdf-parse';
import OpenAI from 'openai';

interface Options {
  prompt: string;
  conversationId?: string;
}

//? External context given as PDF within data folder and cached in memory as string
//? Pass whatever context you want to the model in PDF format
let cachedTerms: string = '';

export const conversationUseCase = async (openai: OpenAI, options: Options) => {
  const prompt = options.prompt;
  let conversationId = options.conversationId;

  //? Cache the terms and conditions if not already cached
  if (!cachedTerms) {
    const pdfBuffer = fs.readFileSync(
      path.resolve(__dirname, '../../../ai-context/terms-and-conditions.pdf'),
    );
    const parser = new PDFParse({ data: pdfBuffer });
    const rawText = (await parser.getText()).text;
    cachedTerms = rawText
      .replace(/(\r\n|\n|\r)/gm, ' ') //? Remove line breaks
      .replace(/\s+/g, ' ') //? Remove extra spaces
      .trim();
  }

  //? Create a new conversation if no conversationId is provided
  if (!conversationId) {
    conversationId = new Date().getTime().toString();
  }

  //? Load existing conversation or create a new one
  const storagePath = path.resolve(
    __dirname,
    '../../../generated/conversations/',
  );
  const filePath = path.join(storagePath, `${conversationId}.json`);

  if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath, { recursive: true });
  }

  let messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

  if (fs.existsSync(filePath)) {
    //? Existing conversation
    const fileContent = await fsPromises.readFile(filePath, 'utf-8');

    messages = JSON.parse(
      fileContent,
    ) as OpenAI.Chat.ChatCompletionMessageParam[];
  } else {
    //? New conversation
    messages = [
      {
        role: 'system',
        content: `Tu nombre es Sam, una abogada para una tienda en línea.
  BASE DE CONOCIMIENTO (Términos y Condiciones): ### ${cachedTerms} ###
  Tu trabajo es responder preguntas sobre el uso de la página basado en BASE DE CONOCIMIENTO (Términos y Condiciones) que te proporcioné.
  Se amable y cordial siempre.
  Sita los títulos de los términos en tus respuestas si es posible.
  Tus respuestas deben iniciar con un saludo cordial si es el inicio de la charla.
  Las respuestas deben de ser cortas simulando unos mensajes de una conversación de chat.
  Pregunta el nombre de la persona para tratarlo de forma más personal.
  Si conoces el nombre de la persona, por favor escríbelo.
  Si no conoces la respuesta o te piden hablar con una persona, ser humano, puedes escalar el caso a:
  "Luciano Figueroa luciano@google.com" o al teléfono de asistencia +54 11 80801111.`.trim(),
      },
    ];
  }

  messages.push({
    role: 'user',
    content: prompt,
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: messages,
  });

  const aiMessage = response.choices[0].message;
  messages.push({
    role: aiMessage.role,
    content: aiMessage.content,
  });

  await fsPromises.writeFile(filePath, JSON.stringify(messages, null, 2));

  return {
    content: aiMessage.content,
    conversationId: conversationId,
  };
};
