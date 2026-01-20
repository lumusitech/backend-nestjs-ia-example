import { FileValidator } from '@nestjs/common';

export class ImageFileTypeValidator extends FileValidator {
  constructor() {
    super({});
  }

  isValid(file: Express.Multer.File): boolean {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];
    return allowedMimeTypes.includes(file.mimetype);
  }

  buildErrorMessage(): string {
    return 'File must be an image (jpeg, jpg, png, webp)';
  }
}
