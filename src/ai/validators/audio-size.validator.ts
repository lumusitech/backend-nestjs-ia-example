import { FileValidator } from '@nestjs/common';

export class AudioFileSizeValidator extends FileValidator {
  constructor() {
    super({});
  }

  isValid(file: Express.Multer.File): boolean {
    //? Max file size in bytes (5MB)
    const maxSize = 1000 * 1024 * 5;

    return file.size <= maxSize;
  }

  buildErrorMessage(): string {
    return 'File size must be less than 5MB';
  }
}
