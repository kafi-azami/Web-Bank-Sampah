import { Inject, Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import { CLOUDINARY } from './cloudinary.provider.js';
import { Readable } from 'stream';
import 'multer'

@Injectable()
export class CloudinaryService {
  constructor(@Inject(CLOUDINARY) private readonly cloudinary: typeof v2) {}

  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        { folder: `bank-sampah/${folder}` },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload gagal, tidak ada hasil.'));
          resolve(result);
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
}