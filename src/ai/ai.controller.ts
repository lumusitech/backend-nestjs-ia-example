import type { Response } from 'express';

import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
} from '@nestjs/common';

import {
  OrthographyDto,
  ProsConsDiscussesDto,
  TranslateDto,
  TextToAudioDto,
  AudioToTextPromptDto,
  ImageGenerationDto,
  ImageVariationDto,
} from './dtos';

import { OrthographyResponse } from './use-cases';

import { AiService } from './ai.service';

import { UploadAudioFile } from 'src/common/decorators';
import { AudioValidationPipe } from 'src/common/pipes';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('orthography-check')
  async orthographyCheck(
    @Body() orthographyDto: OrthographyDto,
  ): Promise<OrthographyResponse> {
    return await this.aiService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusses')
  async prosConsDiscusses(@Body() prosConsDiscussesDto: ProsConsDiscussesDto) {
    return await this.aiService.prosConsDiscusses(prosConsDiscussesDto);
  }

  @Post('pros-cons-discusses-stream')
  async prosConsDiscussesStream(
    @Body() prosConsDiscussesDto: ProsConsDiscussesDto,
    @Res() response: Response,
  ) {
    const stream =
      await this.aiService.prosConsDiscussesStream(prosConsDiscussesDto);

    response.setHeader('Content-Type', 'application/json');
    response.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content ?? '';

      response.write(piece);
    }

    response.end();
  }

  @Post('translate')
  async translate(@Body() translateDto: TranslateDto) {
    return await this.aiService.translate(translateDto);
  }

  //? OPTIONAL: Add a route to stream the translation like the prosConsDiscussesStream route

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() response: Response,
  ) {
    const filePath = await this.aiService.textToAudio(textToAudioDto);

    response.setHeader('Content-Type', 'audio/mp3');
    response.status(HttpStatus.OK);
    response.sendFile(filePath);
  }

  @Get('text-to-audio/:name')
  async textToAudioByName(
    @Res() response: Response,
    @Param('name') name: string,
  ) {
    const filePath = await this.aiService.textToAudioByName(name);

    response.setHeader('Content-Type', 'audio/mp3');
    response.status(HttpStatus.OK);
    response.sendFile(filePath);
  }

  @Post('audio-to-text')
  @UploadAudioFile('file')
  async audioToText(
    @UploadedFile(new AudioValidationPipe())
    file: Express.Multer.File,
    @Body() audioToTextPromptDto: AudioToTextPromptDto,
  ) {
    return await this.aiService.audioToText({
      prompt: audioToTextPromptDto.prompt,
      audioFile: file,
    });
  }

  @Post('image-generation')
  async imageGeneration(@Body() imageGenerationDto: ImageGenerationDto) {
    return await this.aiService.imageGeneration(imageGenerationDto);
  }

  @Get('image-generation/:fileName')
  getGeneratedImage(
    @Param('fileName') fileName: string,
    @Res() response: Response,
  ) {
    const filePath = this.aiService.getGeneratedImage(fileName);

    response.setHeader('Content-Type', 'image/png');
    response.status(HttpStatus.OK);
    response.sendFile(filePath);
  }

  @Post('image-variation')
  async imageVariation(@Body() imageVariationDto: ImageVariationDto) {
    return await this.aiService.generateImageVariation(imageVariationDto);
  }
}
