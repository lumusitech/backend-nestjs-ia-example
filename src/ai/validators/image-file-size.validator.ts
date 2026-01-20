import { FileValidator } from '@nestjs/common';

export class ImageFileSizeValidator extends FileValidator {
  constructor() {
    // 5MB = 5 * 1024 * 1024
    super({ maxSize: 5242880 });
  }

  isValid(file: Express.Multer.File): boolean {
    return file.size <= this.validationOptions.maxSize;
  }

  buildErrorMessage(): string {
    return 'File is bigger than 5MB';
  }
}
