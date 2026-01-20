import { Injectable, ParseFilePipe } from '@nestjs/common';
import {
  ImageFileSizeValidator,
  ImageFileTypeValidator,
} from 'src/ai/validators';

@Injectable()
export class ImageValidationPipe extends ParseFilePipe {
  constructor() {
    super({
      fileIsRequired: true,
      validators: [new ImageFileSizeValidator(), new ImageFileTypeValidator()],
    });
  }
}
