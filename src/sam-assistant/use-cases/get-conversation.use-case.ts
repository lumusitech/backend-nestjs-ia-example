import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import OpenAI from 'openai';

interface Options {
  conversationId: string;
}

export const getConversationUseCase = async (options: Options) => {
  const { conversationId } = options;

  const storagePath = path.resolve(
    __dirname,
    '../../../generated/conversations/',
  );
  const filePath = path.join(storagePath, `${conversationId}.json`);

  if (!fs.existsSync(filePath)) return [];

  const fileContent = await fsPromises.readFile(filePath, 'utf-8');

  const messages = JSON.parse(
    fileContent,
  ) as OpenAI.Chat.ChatCompletionMessageParam[];

  //? exclude system message with its instructions
  return messages.filter((msg) => msg.role !== 'system');
};
