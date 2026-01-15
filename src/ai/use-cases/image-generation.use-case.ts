import { downloadBase64ImageAsPng, downloadImageAsPng } from 'src/helpers';
import * as fs from 'fs';
import { InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';

interface Options {
  prompt: string;
  originalImage?: string; //? Image format base64 encoded
  maskImage?: string; //? Image format base64 encoded
}

export const imageGenerationUseCase = async (
  openai: OpenAI,
  { prompt, originalImage, maskImage }: Options,
) => {
  if (!originalImage || !maskImage) {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    });

    const image = response.data?.[0];

    if (!image?.url) {
      throw new Error('Image generation did not return a valid URL');
    }

    const fileName = await downloadImageAsPng(image.url);
    const url = `${process.env.SERVER_URL}/ai/image-generation/${fileName}`;

    return {
      url, //localhost:3000/ai/image-generation/1768429792892.png
      openAiUrl: image.url,
      revisedPrompt: image.revised_prompt,
    };
  }

  //? originalImage: // localhost:3000/ai/image-generation/1768429792892.png
  const pngImagePath = await downloadImageAsPng(originalImage, true);
  //? maskImage: // Base64 encoded image
  const maskPath = await downloadBase64ImageAsPng(maskImage, true);

  const response = await openai.images.edit({
    model: 'dall-e-3',
    prompt,
    image: fs.createReadStream(pngImagePath),
    mask: fs.createReadStream(maskPath),
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    response_format: 'url',
  });

  const image = response.data?.[0];

  if (!image?.url) {
    throw new InternalServerErrorException(
      'Image generation did not return a valid URL',
    );
  }

  const fileName = await downloadImageAsPng(image.url);
  const url = `${process.env.SERVER_URL}/ai/image-generation/${fileName}`;

  return {
    url, //localhost:3000/ai/image-generation/1768429792892.png
    openAiUrl: image.url,
    revisedPrompt: image.revised_prompt,
  };
};
