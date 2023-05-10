import path from 'path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import { FILE_MIME_SUPPORTED as mimeType, FILE_ICON_SUPPORTED as mimeTypeIcon } from '@constants/storage.constant';

interface IParams {
  filename: string;
  expires?: Date | number;
  isDeleteCdn?: boolean;
}

interface IParamsUpload {
  isIcon?: boolean;
  ext: string;
  filename: string;
  isUploadCdn?: boolean;
  expires?: Date;
}

@Injectable()
export class GoogleStorageFactoryProvider {
  constructor(private readonly configService: ConfigService) {
    this.configService = configService;
  }

  async generateV4UploadSignedUrl(params: IParamsUpload) {
    const { configService } = this;
    const cdnName = configService.get('storage.cdnName');
    const bucketName = configService.get('storage.bucketName');
    const { isIcon, ext, filename, isUploadCdn, expires } = params;
    const options = {
      version: 'v4',
      action: 'write',
      expires: expires || Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: isIcon ? mimeTypeIcon[ext] : mimeType[ext]
    };
    const [url] = await this.storageInit()
      .bucket(isUploadCdn ? cdnName : bucketName)
      .file(filename)
      .getSignedUrl(options as GetSignedUrlConfig);

    return url;
  }

  async generateV4ReadSignedUrl(params: IParams) {
    const { configService } = this;
    const bucketName = configService.get('storage.bucketName');
    const { filename, expires } = params;
    const options = {
      version: 'v4',
      action: 'read',
      expires: expires || Date.now() + 15 * 60 * 1000
    };

    const [url] = await this.storageInit()
      .bucket(bucketName)
      .file(filename)
      .getSignedUrl(options as GetSignedUrlConfig);

    return url;
  }

  async generateV4DeleteSignedUrl(params: IParams) {
    const { configService } = this;
    const cdnName = configService.get('storage.cdnName');
    const bucketName = configService.get('storage.bucketName');
    const { filename, isDeleteCdn } = params;
    const options = {
      version: 'v4',
      action: 'delete',
      expires: Date.now() + 15 * 60 * 1000
    };
    const [url] = await this.storageInit()
      .bucket(isDeleteCdn ? cdnName : bucketName)
      .file(filename)
      .getSignedUrl(options as GetSignedUrlConfig);
    return url;
  }

  storageInit() {
    return new Storage({
      keyFilename: path.join(__dirname, '../../config/service-account/perdana-wahana-sentosa-81ec040aa7da.json'),
      projectId: 'perdana-wahana-sentosa'
    });
  }
}
