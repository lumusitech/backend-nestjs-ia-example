import { InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import OpenAI from 'openai';
import { downloadImageAsPng } from 'src/helpers';

interface Options {
  baseImage: string;
}

export const imageVariationUseCase = async (
  openai: OpenAI,
  { baseImage }: Options,
) => {
  const pngImagePath = await downloadImageAsPng(baseImage, true);

  const response = await openai.images.createVariation({
    model: 'dall-e-2',
    image: fs.createReadStream(pngImagePath),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  const newImage = response.data?.[0];

  if (!newImage?.url) {
    throw new InternalServerErrorException(
      'Image generation did not return a valid URL',
    );
  }

  const fileName = await downloadImageAsPng(newImage.url);
  const url = `${process.env.SERVER_URL}/ai/image-generation/${fileName}`;

  return {
    url, //localhost:3000/ai/image-generation/1768429792892.png
    openAiUrl: newImage.url,
    revisedPrompt: newImage.revised_prompt,
  };
};
