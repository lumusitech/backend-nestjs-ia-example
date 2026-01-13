import OpenAI from 'openai';
import * as path from 'path';
import * as fs from 'fs';

interface Options {
  prompt: string;
  voice?: string;
}

export const textToAudioUseCase = async (
  openai: OpenAI,
  { prompt, voice }: Options,
) => {
  const voices = {
    alloy: 'alloy',
    ash: 'ash',
    ballad: 'ballad',
    coral: 'coral',
    echo: 'echo',
    fable: 'fable',
    onyx: 'onyx',
    nova: 'nova',
    sage: 'sage',
    shimmer: 'shimmer',
    verse: 'verse',
  } as const;

  function isValidVoice(v: string): v is keyof typeof voices {
    return v in voices;
  }

  const selectedVoice =
    voice && isValidVoice(voice) ? voices[voice] : voices.nova;

  //? Create paths
  const folderPath = path.resolve(__dirname, '../../../generated/audios/');
  //! For production, add uuid, userId, etc. in place of only timestamp
  const speechFile = path.resolve(`${folderPath}/${new Date().getTime()}.mp3`);

  //? Create folder if it doesn't exist
  fs.mkdirSync(folderPath, { recursive: true });

  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: selectedVoice,
    input: prompt,
    response_format: 'mp3',
  });

  //? Convert arrayBuffer to Buffer
  const buffer: Buffer<ArrayBuffer> = Buffer.from(await mp3.arrayBuffer());
  //? Write buffer to file
  fs.writeFileSync(speechFile, buffer);

  return speechFile;
};
