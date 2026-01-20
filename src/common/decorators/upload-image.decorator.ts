import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

export function UseImageUpload(fieldName: string = 'file') {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        storage: diskStorage({
          destination: './generated/uploads',
          filename: (req, file, callback) => {
            const fileExtension = file.originalname.split('.').pop();
            const fileName = `${Date.now()}.${fileExtension}`;
            callback(null, fileName);
          },
        }),
      }),
    ),
  );
}
