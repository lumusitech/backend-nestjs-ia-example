import { Injectable, ParseFilePipe } from '@nestjs/common';
import {
  AudioFileSizeValidator,
  AudioFileTypeValidator,
} from 'src/ai/validators';

@Injectable()
export class AudioValidationPipe extends ParseFilePipe {
  constructor() {
    super({
      fileIsRequired: true,
      validators: [new AudioFileSizeValidator(), new AudioFileTypeValidator()],
    });
  }
}
