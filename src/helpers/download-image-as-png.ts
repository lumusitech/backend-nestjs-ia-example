import { InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

export const downloadImageAsPng = async (
  imageUrl: string,
  fullPath: boolean = false,
) => {
  const response = await fetch(imageUrl);

  if (!response.ok)
    throw new InternalServerErrorException('Failed to download image');

  const folderPath = path.resolve(process.cwd(), 'generated/images');
  const imageNamePng = `${new Date().getTime()}.png`;

  //? Create folder if it doesn't exist
  fs.mkdirSync(folderPath, { recursive: true });

  const buffer = Buffer.from(await response.arrayBuffer());
  const filePath = path.resolve(folderPath, imageNamePng);

  // fs.writeFileSync(filePath, buffer);

  await sharp(buffer).png().ensureAlpha().toFile(filePath);

  return fullPath ? filePath : imageNamePng;
};

export const downloadBase64ImageAsPng = async (
  base64Image: string,
  fullPath: boolean = false,
) => {
  // Remove Header
  base64Image = base64Image.split(';base64,').pop()!;
  const imageBuffer = Buffer.from(base64Image, 'base64');

  const folderPath = path.resolve(process.cwd(), 'generated/images');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageNamePng = `${new Date().getTime()}-64.png`;

  const completePath = path.join(folderPath, imageNamePng);

  // Transform to RGBA, png // To match OpenAI requirements
  await sharp(imageBuffer).png().ensureAlpha().toFile(completePath);

  return fullPath ? completePath : imageNamePng;
};
