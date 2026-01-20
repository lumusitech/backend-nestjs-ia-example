import * as path from 'path';
import * as fs from 'fs';

import { Injectable, NotFoundException } from '@nestjs/common';

import OpenAI from 'openai';

import {
  ImageGenerationDto,
  ImageVariationDto,
  OrthographyDto,
  ProsConsDiscussesDto,
  TextToAudioDto,
  TranslateDto,
} from './dtos';

import {
  orthographyCheckUseCase,
  OrthographyResponse,
  prosConsDiscussesStreamUseCase,
  prosConsDiscussesUseCase,
  textToAudioUseCase,
  translateUseCase,
  audioToTextUseCase,
  imageGenerationUseCase,
  imageVariationUseCase,
  imageToTextUseCase,
} from './use-cases';
import { AudioToTextDto } from './dtos/audio-to-text.dto';

@Injectable()
export class AiService {
  private openai: OpenAI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async orthographyCheck(
    orthographyDto: OrthographyDto,
  ): Promise<OrthographyResponse> {
    return await orthographyCheckUseCase(this.openai, {
      prompt: orthographyDto.prompt,
    });
  }

  async prosConsDiscusses({ prompt }: ProsConsDiscussesDto) {
    return await prosConsDiscussesUseCase(this.openai, { prompt });
  }

  async prosConsDiscussesStream({ prompt }: ProsConsDiscussesDto) {
    return await prosConsDiscussesStreamUseCase(this.openai, { prompt });
  }

  async translate({ prompt, lang }: TranslateDto) {
    return await translateUseCase(this.openai, { prompt, lang });
  }

  async textToAudio({ prompt, voice }: TextToAudioDto) {
    return await textToAudioUseCase(this.openai, { prompt, voice });
  }

  async textToAudioByName(name: string) {
    const speechFile = path.resolve(
      __dirname,
      `../../generated/audios/${name}.mp3`,
    );

    const wasFound = fs.existsSync(speechFile);

    if (!wasFound)
      throw new NotFoundException(`Audio with name ${name} not found`);

    return Promise.resolve(speechFile);
  }

  async audioToText({ audioFile, prompt }: AudioToTextDto) {
    return await audioToTextUseCase(this.openai, { audioFile, prompt });
  }

  async imageGeneration(imageGenerationDto: ImageGenerationDto) {
    return await imageGenerationUseCase(this.openai, { ...imageGenerationDto });
  }

  getGeneratedImage(fileName: string) {
    const imageFile = path.resolve(process.cwd(), 'generated/images', fileName);

    const wasFound = fs.existsSync(imageFile);

    if (!wasFound)
      throw new NotFoundException(`Image with name ${fileName} not found`);

    return imageFile;
  }

  async generateImageVariation({ baseImage }: ImageVariationDto) {
    return await imageVariationUseCase(this.openai, {
      baseImage,
    });
  }

  async imageToText(imageFile: Express.Multer.File, prompt: string) {
    return await imageToTextUseCase(this.openai, { imageFile, prompt });
  }
}
