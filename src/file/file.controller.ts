import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadedFile(@UploadedFile() file: any) {
    const path = 'http://localhost:3000' + file.path.replace('public', '')
    return { path }
  }
}
