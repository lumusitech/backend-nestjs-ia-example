import { FileValidator } from '@nestjs/common';

export class AudioFileTypeValidator extends FileValidator {
  constructor() {
    super({});
  }

  isValid(file: Express.Multer.File): boolean {
    //? MIME types allowed for audio files
    const allowedMimeTypes = [
      'audio/m4a',
      'audio/x-m4a',
      'audio/mp3',
      'audio/mp4',
      'video/mp4',
    ];

    return allowedMimeTypes.includes(file.mimetype);
  }

  buildErrorMessage(): string {
    return 'File must be an audio file (m4a, mp4)';
  }
}
