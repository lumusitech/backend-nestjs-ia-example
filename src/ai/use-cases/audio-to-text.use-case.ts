import * as fs from 'fs';

import OpenAI from 'openai';

interface Options {
  audioFile: Express.Multer.File;
  prompt?: string;
}

export const audioToTextUseCase = async (
  openai: OpenAI,
  { audioFile, prompt }: Options,
) => {
  const transcription = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    file: fs.createReadStream(audioFile.path),
    prompt: prompt ?? '', //? It must be equal to audio language.
    language: 'es',
    // response_format: 'vtt', // or 'srt' or 'json' or 'text' or 'verbose_json'
    response_format: 'verbose_json', //? Give us more info about the transcription
  });

  return transcription;
};
